import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  googleProvider
} from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // 🔥 Login con correo
  const loginEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🔥 Login con Google
  const loginGoogle = () => signInWithPopup(auth, googleProvider);

  // 🔥 Logout
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginEmail,
        loginGoogle,
        logout,
        isLogged: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
