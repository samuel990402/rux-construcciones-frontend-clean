import { Navigate } from "react-router-dom";
import { auth } from "@/firebase";

export default function AuthGuard({ children }) {
  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
}
