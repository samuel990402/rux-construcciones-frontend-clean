import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function TechRoute({ children }) {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "techs", auth.currentUser.uid));
      setOk(snap.exists());
    })();
  }, []);

  if (ok === null) return null;
  if (!ok) return <Navigate to="/" />;

  return children;
}
