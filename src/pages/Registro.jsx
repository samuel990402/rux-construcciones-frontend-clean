// src/pages/Registro.jsx
import React, { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Cuenta creada correctamente");
      navigate("/planes");
    } catch (err) {
      console.error(err);
      alert("Error al registrar usuario");
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
        Crear Cuenta
      </h1>

      <form onSubmit={handleRegister}>
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
          placeholder="Contraseña (mínimo 6 caracteres)"
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
          Registrar
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" style={{ color: "#D4AF37" }}>
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
