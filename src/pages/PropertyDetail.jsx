import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(() => setProperty(null));
  }, [id]);

  if (!property) return <p>Cargando propiedad...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>{property.title}</h1>

      {property.images?.[0] && (
        <img
          src={property.images[0]}
          alt={property.title}
          style={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
      )}

      <p>{property.description}</p>
      <p><b>{property.price}</b></p>
      <p>{property.location}</p>
    </div>
  );
}
