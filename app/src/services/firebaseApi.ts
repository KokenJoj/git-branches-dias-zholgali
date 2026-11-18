import { ServiceError, type GreenWeekendApi } from "./types";

/**
 * Firebase-ready boundary. The app talks only to GreenWeekendApi.
 * Swap `api` in ./index.ts for this implementation after adding the
 * Firebase web SDK and a config object.
 *
 * Suggested mapping:
 * - signUp / signIn / signOut -> Firebase Auth (email + password)
 * - users/{uid} -> profile name
 * - greenhouses/{uid} -> one greenhouse document per account
 * - greenhouses/{uid}/history -> readings (temp, soil, humidity, light)
 * - greenhouses/{uid}/alerts -> threshold and automatic-action log
 * - greenhouses/{uid}/photos -> photo diary metadata; files in Storage
 * - onSnapshot(greenhouses/{uid}) -> live dashboard metrics
 */
export const firebaseApi: GreenWeekendApi = {
  load() {
    throw new ServiceError("not-configured", "Add Firebase config before calling firebaseApi.load.");
  },
  persist() {
    throw new ServiceError("not-configured", "Add Firebase config before writing greenhouse data.");
  },
  async signUp() {
    throw new ServiceError("not-configured", "Wire Firebase Auth createUserWithEmailAndPassword here.");
  },
  async signIn() {
    throw new ServiceError("not-configured", "Wire Firebase Auth signInWithEmailAndPassword here.");
  },
  async signOut() {
    throw new ServiceError("not-configured", "Wire Firebase Auth signOut here.");
  },
};
