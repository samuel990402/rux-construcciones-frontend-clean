// src/components/Auth.jsx
import React, { useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "../firebase";

export default function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Observador de estado de auth (mantiene token actualizado)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Obtener ID token y guardarlo en localStorage
        const idToken = await u.getIdToken(/* forceRefresh = */ false);
        localStorage.setItem("firebaseToken", idToken);
        // Opcional: también guardar user info
        localStorage.setItem("firebaseUser", JSON.stringify({
          uid: u.uid, email: u.email, displayName: u.displayName
        }));
      } else {
        setUser(null);
        localStorage.removeItem("firebaseToken");
        localStorage.removeItem("firebaseUser");
      }
    });

    return () => unsubscribe();
  }, []);

  // Login con Google
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged se encargará de guardar token
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error Google signIn:", err);
      alert("Error al iniciar con Google: " + err.message);
    }
  };

  // Login con email (ya existente)
  const handleEmailSignIn = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error email signIn:", err);
      alert("Error al iniciar con email: " + err.message);
    }
  };

  // Crear cuenta con email
  const handleCreateAccount = async (email, password) => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error crear cuenta:", err);
      alert("Error al crear cuenta: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("firebaseUser");
    setUser(null);
  };

  // Simple UI: botones de login y logout
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <div className="text-sm text-white hidden md:block">
            {user.displayName || user.email}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-white/5 text-[#D4AF37] rounded-sm"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleGoogleSignIn}
            className="px-3 py-2 bg-[#D4AF37] text-black rounded-sm"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar con Google"}
          </button>

          {/* Ejemplo: mostrar formulario pequeño para email */}
          <EmailLogin
            onSignIn={handleEmailSignIn}
            onCreate={handleCreateAccount}
          />
        </>
      )}
    </div>
  );
}

// Componente pequeño para login por email (puedes estilizarlo)
function EmailLogin({ onSignIn, onCreate }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="flex items-center gap-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="px-2 py-1 rounded bg-[#0b0b0b] text-white text-sm border border-white/5"
      />
      <input
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="contraseña"
        type="password"
        className="px-2 py-1 rounded bg-[#0b0b0b] text-white text-sm border border-white/5"
      />
      <button
        onClick={() => onSignIn(email, pass)}
        className="px-3 py-1 bg-white/5 rounded text-sm text-[#D4AF37]"
      >
        Iniciar
      </button>
      <button
        onClick={() => onCreate(email, pass)}
        className="px-3 py-1 bg-white/5 rounded text-sm text-gray-300"
      >
        Crear
      </button>
    </div>
  );
}
