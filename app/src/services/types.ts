import type { PersistedData } from "../types";

export class ServiceError extends Error {
  code: "wrong-password" | "user-not-found" | "email-taken" | "invalid" | "offline" | "not-configured";

  constructor(code: ServiceError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface GreenWeekendApi {
  load(): PersistedData;
  persist(data: PersistedData): void;
  signUp(data: PersistedData, input: SignUpInput): Promise<PersistedData>;
  signIn(data: PersistedData, input: SignInInput): Promise<PersistedData>;
  signOut(data: PersistedData): Promise<PersistedData>;
}
