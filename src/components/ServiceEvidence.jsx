import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function ServiceEvidence({ serviceId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState("general");

  async function loadEvidence() {
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get(
      `${API_BASE}/api/service-events/${serviceId}/evidence`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFiles(res.data.evidence || []);
    setLoading(false);
  }

  async function uploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const token = await auth.currentUser.getIdToken();
    const form = new FormData();
    form.append("file", file);
    form.append("stage", stage);

    await axios.post(
      `${API_BASE}/api/service-events/${serviceId}/upload`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setUploading(false);
    loadEvidence();
  }

  useEffect(() => {
    loadEvidence();
  }, []);

  if (loading) return <div>Cargando evidencias…</div>;

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ color: "#D4AF37" }}>Evidencias</h3>

      <div style={{ marginBottom: 10 }}>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="general">General</option>
          <option value="before">Antes</option>
          <option value="during">Durante</option>
          <option value="after">Después</option>
        </select>

        <input
          type="file"
          onChange={uploadFile}
          disabled={uploading}
          style={{ marginLeft: 10 }}
        />
      </div>

      {uploading && <p>Subiendo archivo…</p>}

      {files.length === 0 && <p>No hay evidencias.</p>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {files.map((f) => (
          <a
            key={f.id}
            href={f.url}
            target="_blank"
            rel="noreferrer"
            style={{
              border: "1px solid #333",
              padding: 6,
              textDecoration: "none",
              color: "white",
            }}
          >
            <img
              src={f.url}
              alt=""
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {f.stage}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
