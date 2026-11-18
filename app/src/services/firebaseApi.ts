import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import type { Greenhouse, PersistedData, UserRecord } from "../types";
import { emptyData } from "../types";
import { getFirebase, isFirebaseConfigured } from "./firebaseApp";
import { buildSeedGreenhouse, firestoreToGreenhouse, greenhouseToFirestore } from "./greenhouseMapper";
import { ServiceError, type GreenWeekendApi, type SignInInput, type SignUpInput } from "./types";

type GreenhouseListener = (greenhouse: Greenhouse | null) => void;

let authReady: Promise<User | null> | null = null;
let unsubscribeGreenhouse: (() => void) | null = null;
const greenhouseListeners = new Set<GreenhouseListener>();

function mapAuthError(error: unknown): never {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : "";
  if (code.includes("email-already-in-use")) throw new ServiceError("email-taken", "An account with this email already exists.");
  if (code.includes("user-not-found") || code.includes("invalid-credential")) {
    throw new ServiceError("wrong-password", "Incorrect email or password.");
  }
  if (code.includes("wrong-password")) throw new ServiceError("wrong-password", "Incorrect password");
  if (code.includes("invalid-email")) throw new ServiceError("invalid", "Enter a valid email.");
  if (code.includes("weak-password")) throw new ServiceError("invalid", "Password must be at least 6 characters.");
  throw new ServiceError("invalid", "Firebase request failed.");
}

function toUserRecord(user: User, name?: string): UserRecord {
  return {
    id: user.uid,
    name: name || user.displayName || "Grower",
    email: user.email || "",
    password: "",
  };
}

async function waitForAuth() {
  if (!authReady) {
    const { auth } = getFirebase();
    authReady = new Promise((resolve) => {
      const stop = onAuthStateChanged(auth, (user) => {
        stop();
        resolve(user);
      });
    });
  }
  return authReady;
}

function greenhouseRef(uid: string) {
  return doc(getFirebase().db, "greenhouses", uid);
}

function userRef(uid: string) {
  return doc(getFirebase().db, "users", uid);
}

async function readGreenhouse(uid: string) {
  const snap = await getDoc(greenhouseRef(uid));
  if (!snap.exists()) return null;
  return firestoreToGreenhouse(snap.data() as Record<string, unknown>);
}

async function writeGreenhouse(uid: string, greenhouse: Greenhouse) {
  await setDoc(greenhouseRef(uid), greenhouseToFirestore(greenhouse), { merge: true });
}

function notifyGreenhouse(greenhouse: Greenhouse | null) {
  for (const listener of greenhouseListeners) listener(greenhouse);
}

export function subscribeGreenhouse(listener: GreenhouseListener) {
  greenhouseListeners.add(listener);
  return () => greenhouseListeners.delete(listener);
}

export function watchUserGreenhouse(uid: string | null) {
  unsubscribeGreenhouse?.();
  unsubscribeGreenhouse = null;
  if (!uid) {
    notifyGreenhouse(null);
    return;
  }
  unsubscribeGreenhouse = onSnapshot(
    greenhouseRef(uid),
    (snap) => {
      if (!snap.exists()) {
        notifyGreenhouse(null);
        return;
      }
      notifyGreenhouse(firestoreToGreenhouse(snap.data() as Record<string, unknown>));
    },
    () => {},
  );
}

async function buildSession(user: User): Promise<PersistedData> {
  const profile = await getDoc(userRef(user.uid));
  const name = profile.exists() ? String((profile.data() as { name?: string }).name || user.displayName || "Grower") : user.displayName || "Grower";
  const greenhouse = await readGreenhouse(user.uid);
  return {
    ...emptyData(),
    users: [toUserRecord(user, name)],
    sessionUserId: user.uid,
    online: typeof navigator === "undefined" ? true : navigator.onLine,
    greenhouses: greenhouse ? { [user.uid]: greenhouse } : {},
  };
}

export const firebaseApi: GreenWeekendApi = {
  load() {
    if (!isFirebaseConfigured()) {
      throw new ServiceError("not-configured", "Firebase config is missing");
    }
    return emptyData();
  },

  persist(data) {
    const uid = data.sessionUserId;
    if (!uid) return;
    const greenhouse = data.greenhouses[uid];
    if (!greenhouse) return;
    void writeGreenhouse(uid, greenhouse).catch(() => {});
  },

  async signUp(_data, input: SignUpInput) {
    try {
      const { auth } = getFirebase();
      const credential = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
      await updateProfile(credential.user, { displayName: input.name.trim() });
      await setDoc(userRef(credential.user.uid), {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        createdAt: Date.now(),
      });
      const session = await buildSession(credential.user);
      watchUserGreenhouse(credential.user.uid);
      return session;
    } catch (error) {
      mapAuthError(error);
    }
  },

  async signIn(_data, input: SignInInput) {
    try {
      const { auth } = getFirebase();
      const credential = await signInWithEmailAndPassword(auth, input.email.trim(), input.password);
      const session = await buildSession(credential.user);
      watchUserGreenhouse(credential.user.uid);
      return session;
    } catch (error) {
      mapAuthError(error);
    }
  },

  async signOut(_data) {
    const { auth } = getFirebase();
    watchUserGreenhouse(null);
    await firebaseSignOut(auth);
    return emptyData();
  },
};

export async function bootstrapFirebaseSession(): Promise<PersistedData> {
  if (!isFirebaseConfigured()) return emptyData();
  const user = await waitForAuth();
  if (!user) return emptyData();
  const session = await buildSession(user);
  watchUserGreenhouse(user.uid);
  return session;
}

export async function ensureSeedGreenhouse(uid: string, name: string, code: string) {
  const existing = await readGreenhouse(uid);
  if (existing) return existing;
  const seeded = buildSeedGreenhouse(name, code);
  await writeGreenhouse(uid, seeded);
  return seeded;
}

export async function removeGreenhouse(uid: string) {
  await deleteDoc(greenhouseRef(uid));
}
