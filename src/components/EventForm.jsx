import { useState } from "react";
import api from "../services/api";
import "../styles/main.css";

export default function EventForm({ onEventAdded }) {
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    ubicacion: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/eventos", formData);
      setSuccess(res.data.message);
      setFormData({ nombre: "", fecha: "", ubicacion: "", descripcion: "" });

      // Actualiza la lista de eventos en el dashboard
      if (onEventAdded) onEventAdded();

    } catch (err) {
      setError("Error al registrar el evento. Intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Nuevo Evento</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Nombre del Evento</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Registrar Evento"}
        </button>

        {success && <p className="msg success">{success}</p>}
        {error && <p className="msg error">{error}</p>}
      </form>
    </div>
  );
}
