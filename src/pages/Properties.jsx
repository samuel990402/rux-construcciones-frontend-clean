import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
const [enabled, setEnabled] = useState(null);
const [activeImage, setActiveImage] = useState({});


useEffect(() => {
  axios
    .get("http://localhost:4000/api/settings/site")
    .then(res => {
      if (!res.data.inmobiliariaEnabled) {
        navigate("/");
      } else {
        setEnabled(true);
      }
    })
    .catch(() => navigate("/"));
}, [navigate]);


  useEffect(() => {
    axios
      .get("http://localhost:4000/api/properties")
      .then(res => setProperties(res.data))
      .catch(() => setProperties([]));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  function nextImage(propertyId, imagesLength) {
  setActiveImage(prev => ({
    ...prev,
    [propertyId]: ((prev[propertyId] ?? 0) + 1) % imagesLength,
  }));
}

function prevImage(propertyId, imagesLength) {
  setActiveImage(prev => ({
    ...prev,
    [propertyId]:
      (prev[propertyId] ?? 0) === 0
        ? imagesLength - 1
        : prev[propertyId] - 1,
  }));
}

const arrowStyle = side => ({
  position: "absolute",
  top: "50%",
  [side]: 10,
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 36,
  height: 36,
  cursor: "pointer",
  fontSize: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});


  if (enabled === null) return null;

  return (
    <div style={{ padding: 40 }}>
      <h1>Propiedades disponibles</h1>

      {properties.length === 0 && <p>No hay propiedades.</p>}

      {properties.map(p => {
  const index = activeImage[p.id] ?? 0;

  return (
    <div
      key={p.id}
      style={{ marginBottom: 50, cursor: "pointer" }}
      onClick={() => navigate(`/propiedad/${p.id}`)}
    >

      {/* CONTENEDOR IMAGEN */}
      {p.images?.length > 0 && (
        <div
          style={{
            position: "relative",
            width: 400,
            height: 260,
            overflow: "hidden",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <img
            src={
    property.image.startsWith("http")
      ? property.image
      : property.image.startsWith("/") 
        ? property.image
        : `${process.env.REACT_APP_API_URL}/${property.image}`
  }
            alt={p.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* FLECHA IZQUIERDA */}
          <button
            onClick={e => {
              e.stopPropagation(); // 🔥 IMPORTANTE
              prevImage(p.id, p.images.length);
            }}
            style={arrowStyle("left")}
          >
            ‹
          </button>

          {/* FLECHA DERECHA */}
          <button
            onClick={e => {
              e.stopPropagation(); // 🔥 IMPORTANTE
              nextImage(p.id, p.images.length);
            }}
            style={arrowStyle("right")}
          >
            ›
          </button>
        </div>
      )}

      <h3>{p.title}</h3>
      <p>{p.description}</p>
      <p><b>{p.price}</b></p>
      <p>{p.location}</p>

    </div>
  );
})}
    </div>
  );
}
