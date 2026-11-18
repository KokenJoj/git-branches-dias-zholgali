import type { PersistedData } from "../types";
import { emptyData } from "../types";
import { ServiceError, type GreenWeekendApi, type SignInInput, type SignUpInput } from "./types";

const KEY = "greenweekend.v1";

function wait(ms = 280) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export const localApi: GreenWeekendApi = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptyData();
      const parsed = JSON.parse(raw) as PersistedData;
      if (parsed.version !== 1 || !Array.isArray(parsed.users)) return emptyData();
      return { ...emptyData(), ...parsed, greenhouses: parsed.greenhouses ?? {} };
    } catch {
      return emptyData();
    }
  },
  persist(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // The session still works in memory if storage is full.
    }
  },
  async signUp(data, input: SignUpInput) {
    await wait();
    const email = normalize(input.email);
    if (data.users.some((user) => user.email === email)) {
      throw new ServiceError("email-taken", "An account with this email already exists.");
    }
    const user = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      email,
      password: input.password,
    };
    const next = { ...data, users: [...data.users, user], sessionUserId: user.id };
    this.persist(next);
    return next;
  },
  async signIn(data, input: SignInInput) {
    await wait();
    const email = normalize(input.email);
    const user = data.users.find((item) => item.email === email);
    if (!user) throw new ServiceError("user-not-found", "No account for this email.");
    if (user.password !== input.password) throw new ServiceError("wrong-password", "Incorrect password");
    const next = { ...data, sessionUserId: user.id };
    this.persist(next);
    return next;
  },
  async signOut(data) {
    await wait(160);
    const next = { ...data, sessionUserId: null };
    this.persist(next);
    return next;
  },
};
