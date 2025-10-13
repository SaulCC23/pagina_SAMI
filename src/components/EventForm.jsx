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
  const [fieldErrors, setFieldErrors] = useState({});

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    const today = getCurrentDate();

    // Validar que la fecha no sea anterior a hoy
    if (formData.fecha && formData.fecha < today) {
      errors.fecha = "No puedes seleccionar una fecha pasada";
    }

    // Validar que el nombre no esté vacío
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del evento es obligatorio";
    }

    // Validar que la fecha no esté vacía
    if (!formData.fecha) {
      errors.fecha = "La fecha del evento es obligatoria";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/eventos", formData);
      setSuccess(res.data.message);
      setFormData({ nombre: "", fecha: "", ubicacion: "", descripcion: "" });
      setFieldErrors({});

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
    <div className="form-enhanced">
      <div className="form-header">
        <div className="form-icon">📋</div>
        <div className="form-title">
          <h2>Registrar Nuevo Evento</h2>
          <p>Completa la información del evento para el sistema SAMI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="enhanced-form">
        <div className="form-grid">
          <div className="form-group enhanced">
            <label className="form-label">
              <span className="label-icon">🏷️</span>
              Nombre del Evento *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className={`form-input ${fieldErrors.nombre ? 'error' : ''}`}
              placeholder="Ej: Conferencia de Tecnología 2024"
            />
            {fieldErrors.nombre && (
              <span className="field-error">{fieldErrors.nombre}</span>
            )}
          </div>

          <div className="form-group enhanced">
            <label className="form-label">
              <span className="label-icon">📅</span>
              Fecha del Evento *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              min={getCurrentDate()} // Esto evita que seleccionen fechas pasadas
              className={`form-input ${fieldErrors.fecha ? 'error' : ''}`}
            />
            {fieldErrors.fecha ? (
              <span className="field-error">{fieldErrors.fecha}</span>
            ) : (
              <span className="field-hint"></span>
            )}
          </div>

          <div className="form-group enhanced">
            <label className="form-label">
              <span className="label-icon">📍</span>
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: Auditorio Principal, Campus Central"
            />
          </div>

          <div className="form-group enhanced full-width">
            <label className="form-label">
              <span className="label-icon">📝</span>
              Descripción del Evento
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe los objetivos, actividades y público objetivo del evento..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="form-footer">
          <div className="required-hint">
            <span>* Campos obligatorios</span>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Guardando Evento...
                </>
              ) : (
                <>
                  <span className="btn-icon">✓</span>
                  Registrar Evento
                </>
              )}
            </button>

            <button 
              type="button" 
              onClick={() => {
                setFormData({ nombre: "", fecha: "", ubicacion: "", descripcion: "" });
                setFieldErrors({});
                setError("");
                setSuccess("");
              }}
              className="clear-btn"
            >
              <span className="btn-icon">↻</span>
              Limpiar Formulario
            </button>
          </div>
        </div>

        {success && (
          <div className="message success">
            <span className="message-icon">✅</span>
            <div>
              <strong>¡Éxito!</strong>
              <p>{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="message error">
            <span className="message-icon">❌</span>
            <div>
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}