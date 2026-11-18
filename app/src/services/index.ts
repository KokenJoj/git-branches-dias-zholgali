import { isFirebaseConfigured } from "./firebaseApp";
import { firebaseApi } from "./firebaseApi";
import { localApi } from "./localApi";

export const useFirebase = isFirebaseConfigured();
export const api = useFirebase ? firebaseApi : localApi;

export { firebaseApi } from "./firebaseApi";
export { localApi } from "./localApi";
export { isFirebaseConfigured } from "./firebaseApp";
export {
  bootstrapFirebaseSession,
  ensureSeedGreenhouse,
  removeGreenhouse,
  subscribeGreenhouse,
  watchUserGreenhouse,
} from "./firebaseApi";
export { ServiceError } from "./types";
export type { GreenWeekendApi, SignInInput, SignUpInput } from "./types";
