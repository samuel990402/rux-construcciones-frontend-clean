import { auth } from "../firebase";

export function getUserToken() {
  return auth.currentUser?.getIdToken();
}
