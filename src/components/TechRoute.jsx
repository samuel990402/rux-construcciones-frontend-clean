import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

export default function TechRoute({ children }) {
  const role = useUserRole();

  // Cargando
  if (role === null) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Cargando panel técnico...
      </div>
    );
  }

  // Solo técnicos
  if (role !== "tech") {
    return <Navigate to="/" replace />;
  }

  return children;
}
