import { useState, useEffect } from "react";
import "../styles/event-modal.css";
import api from "../services/api";

const EventManagementModal = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      if (!isOpen) return;

      setLoading(true);
      setError(null);
      try {
        // Usamos el API configurado en lugar de fetch directo
        const response = await api.get('/eventos');
        setEvents(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar los eventos');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [isOpen]);

  const handleDownloadPDF = async (event) => {
    try {
      // Simulación de descarga - puedes implementar el endpoint real después
      const link = document.createElement('a');
      link.href = `#`; // Reemplaza con tu endpoint real: `/api/eventos/${event.id}/pdf`
      link.download = `evento-${event.nombre.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Descargando PDF del evento: ${event.nombre}`);
    } catch (err) {
      alert('Error al descargar el PDF');
    }
  };

  const handleDownloadAllPDF = async () => {
    try {
      // Simulación de descarga - puedes implementar el endpoint real después
      const link = document.createElement('a');
      link.href = `#`; // Reemplaza con tu endpoint real: '/api/eventos/pdf'
      link.download = 'todos-los-eventos.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert("Descargando PDF con todos los eventos");
    } catch (err) {
      alert('Error al descargar todos los PDFs');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'No especificada';
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Gestión de Eventos</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="modal-actions">
            <button 
              className="btn-download-all"
              onClick={handleDownloadAllPDF}
              disabled={events.length === 0 || loading}
            >
              📥 Descargar Todos los Eventos (PDF)
            </button>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando eventos...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
              <button 
                onClick={() => window.location.reload()} 
                style={{marginLeft: '10px', padding: '5px 10px'}}
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="events-list">
              {events.length === 0 ? (
                <div className="no-events">
                  <p>No hay eventos disponibles</p>
                  <p style={{fontSize: '0.9em', marginTop: '10px'}}>
                    Crea tu primer evento desde el dashboard
                  </p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-details">
                      <div className="event-header">
                        <h3 className="event-title">{event.nombre}</h3>
                        <span className={`event-status status-${event.estado || 'activo'}`}>
                          {event.estado || 'activo'}
                        </span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">📅 Fecha:</span>
                        <span className="detail-value">
                          {event.fecha ? new Date(event.fecha).toLocaleDateString('es-ES') : 'No especificada'}
                        </span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">⏰ Hora:</span>
                        <span className="detail-value">
                          {formatTime(event.hora)}
                        </span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">📍 Lugar:</span>
                        <span className="detail-value">{event.ubicacion || 'No especificado'}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">📝 Descripción:</span>
                        <span className="detail-value">{event.descripcion || 'Sin descripción'}</span>
                      </div>

                      {(event.total_participantes !== null && event.total_participantes !== undefined) && (
                        <div className="event-stats">
                          <div className="stats-title">Estadísticas de Participación</div>
                          <div className="stats-grid">
                            <div className="stat-item">
                              <span className="stat-label">Total</span>
                              <span className="stat-value">{event.total_participantes}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Hombres</span>
                              <span className="stat-value">{event.hombres || 0}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Mujeres</span>
                              <span className="stat-value">{event.mujeres || 0}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="event-actions">
                      <button 
                        className="btn-download"
                        onClick={() => handleDownloadPDF(event)}
                        disabled={loading}
                      >
                        📄 Descargar PDF
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          Total de eventos: {events.length} | SAMI - Sistema Autónomo
        </div>
      </div>
    </div>
  );
};

export default EventManagementModal;