import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export function useUserRole() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setRole("guest");
          return;
        }

        const token = await user.getIdToken();

        const res = await axios.get(
          `${API_BASE}/api/admin/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRole(res.data.role || "user");
      } catch (err) {
        console.error("Error cargando rol:", err);
        setRole("user");
      }
    }

    load();
  }, []);

  return role;
}
