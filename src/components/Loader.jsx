export default function Loader({ text = "Cargando..." }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "#D4AF37" }}>
      <div style={{ marginBottom: 15 }}>⏳</div>
      <p>{text}</p>
    </div>
  );
}
