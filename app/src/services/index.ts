import { firebaseApi } from "./firebaseApi";
import { localApi } from "./localApi";

export const api = localApi;
export { firebaseApi };
export { ServiceError } from "./types";
export type { GreenWeekendApi, SignInInput, SignUpInput } from "./types";
