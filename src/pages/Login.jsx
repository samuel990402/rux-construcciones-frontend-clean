// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Sesión iniciada correctamente");
      navigate("/planes");
    } catch (err) {
      console.error(err);
      alert("Correo o contraseña incorrectos");
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Sesión iniciada con Google");
      navigate("/planes");
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión con Google");
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "400px",
        margin: "0 auto",
        color: "white",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Iniciar Sesión
      </h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#D4AF37",
            color: "black",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>

      {/* 🔥 BOTÓN DE GOOGLE LOGIN */}
      <button
        onClick={handleGoogleLogin}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          background: "white",
          color: "black",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        🚀 Entrar con Google
      </button>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        ¿No tienes cuenta?{" "}
        <Link to="/registro" style={{ color: "#D4AF37" }}>
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
