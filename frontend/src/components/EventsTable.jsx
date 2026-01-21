import { useEffect, useState, useCallback } from "react";

import api from "../services/api";
import "../styles/main.css";

export default function EventsTable({ refresh }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarCancelados, setMostrarCancelados] = useState(false);

  const fetchEventos = useCallback(() => {
    setLoading(true);
    const url = mostrarCancelados 
      ? "/eventos?incluir_cancelados=true" 
      : "/eventos";
    
    api.get(url)
      .then(res => {
        setEventos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [mostrarCancelados]);

  useEffect(() => {
    fetchEventos();
  }, [refresh, mostrarCancelados, fetchEventos]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const isUpcomingEvent = (fecha, hora, estado) => {
    if (estado === 'cancelado') return false;
    
    const now = new Date();
    const eventDate = new Date(fecha);
    
    // Si la fecha es futura (mañana o después), es próximo
    if (eventDate > now && eventDate.getDate() !== now.getDate()) return true;

    // Si es HOY, comparar hora
    if (eventDate.toDateString() === now.toDateString()) {
       if (!hora) return true; // Si no hay hora, asumir próximo por defecto
       const [hours, minutes] = hora.split(':');
       eventDate.setHours(parseInt(hours), parseInt(minutes), 0);
       return eventDate > now;
    }

    return false; // Fecha pasada
  };

  const handleCancelEvent = (eventId) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar este evento?\n\nLos eventos cancelados no se mostrarán en los reportes principales.")) {
      api.put(`/eventos/${eventId}/cancelar`)
        .then(() => {
          alert("Evento cancelado exitosamente");
          fetchEventos();
        })
        .catch(err => {
          console.error(err);
          alert("Error al cancelar el evento");
        });
    }
  };

  const handleReactivateEvent = (eventId) => {
    if (window.confirm("¿Estás seguro de que deseas reactivar este evento?")) {
      api.put(`/eventos/${eventId}/reactivar`)
        .then(() => {
          alert("Evento reactivado exitosamente");
          fetchEventos();
        })
        .catch(err => {
          console.error(err);
          alert("Error al reactivar el evento");
        });
    }
  };

  const eventosActivos = eventos.filter(e => e.estado !== 'cancelado');
  const eventosCancelados = eventos.filter(e => e.estado === 'cancelado');



  return (
    <div className="table-enhanced">
      <div className="table-header">
        <div className="table-title">
          <h2>Eventos Registrados</h2>
          <p>
            {mostrarCancelados 
              ? "Lista completa de eventos (incluyendo cancelados)" 
              : "Eventos activos en el sistema SAMI"}
          </p>
        </div>
        <div className="table-controls">
          <div className="table-stats">
            <span className="stat-badge">
              Activos: {eventosActivos.length}
            </span>
            {eventosCancelados.length > 0 && (
              <span className="stat-badge canceled">
                Cancelados: {eventosCancelados.length}
              </span>
            )}
          </div>

          <div className="toggle-cancelados">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={mostrarCancelados}
                onChange={(e) => setMostrarCancelados(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Mostrar Cancelados
            </label>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando eventos...</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <h3>No hay eventos registrados</h3>
            <p>Los eventos que agregues aparecerán aquí</p>
          </div>
        ) : (
          <table className="enhanced-table">
            <thead>
              <tr>
                <th className="event-name">Evento</th>
                <th className="event-date">Fecha</th>
                <th className="event-location">Ubicación</th>
                <th className="event-status">Estado</th>
                <th className="event-participants">Total</th>
                <th className="event-gender">Mujeres</th>
                <th className="event-gender">Hombres</th>
                <th className="event-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id} className={`${isUpcomingEvent(e.fecha, e.hora, e.estado) ? 'upcoming-event' : ''} ${e.estado === 'cancelado' ? 'canceled-event' : ''}`}>
                  <td className="event-name">
                    <div className="event-info">
                      <strong>{e.nombre}</strong>
                      {e.descripcion && (
                        <span className="event-description">{e.descripcion}</span>
                      )}
                    </div>
                  </td>
                  <td className="event-date">
                    <div className="date-container">
                      <span className="date-value">
                        {new Date(e.fecha).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {isUpcomingEvent(e.fecha, e.hora, e.estado) && (
                        <span className="upcoming-badge">Próximo</span>
                      )}
                    </div>
                  </td>
                  <td className="event-location">
                    {e.ubicacion || <span className="no-data">No especificado</span>}
                  </td>
                  <td className="event-status">
                    <span className={`status-simple ${e.estado === 'cancelado' ? 'canceled' : 'active'}`}>
                      {e.estado === 'cancelado' ? 'CANCELADO' : 'ACTIVO'}
                    </span>
                  </td>
                  <td className="event-participants">
                    <div className="participants-count">
                      <span className="count-value">{formatNumber(e.total_participantes ?? 0)}</span>
                    </div>
                  </td>
                  <td className="event-gender female">
                    <div className="gender-stats">
                      <span className="gender-value">{formatNumber(e.mujeres ?? 0)}</span>
                      {e.total_participantes > 0 && (
                        <span className="gender-percentage">
                          ({Math.round(((e.mujeres ?? 0) / e.total_participantes) * 100)}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="event-gender male">
                    <div className="gender-stats">
                      <span className="gender-value">{formatNumber(e.hombres ?? 0)}</span>
                      {e.total_participantes > 0 && (
                        <span className="gender-percentage">
                          ({Math.round(((e.hombres ?? 0) / e.total_participantes) * 100)}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="event-actions">

                    {e.estado === 'cancelado' ? (
                      <button 
                        className="btn-reactivate"
                        onClick={() => handleReactivateEvent(e.id)}
                        title="Reactivar evento"
                      >
                        Reactivar
                      </button>
                    ) : (
                      <button 
                        className="btn-cancel"
                        onClick={() => handleCancelEvent(e.id)}
                        title="Cancelar evento"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && eventos.length > 0 && (
        <div className="table-footer">
          <div className="footer-info">
            <span>
              Mostrando {eventos.length} evento{eventos.length !== 1 ? 's' : ''}
              {mostrarCancelados && ` (${eventosActivos.length} activos, ${eventosCancelados.length} cancelados)`}
            </span>
            {!mostrarCancelados && (
              <span className="upcoming-count">
                • {eventosActivos.filter(e => isUpcomingEvent(e.fecha, e.estado)).length} próximo{eventosActivos.filter(e => isUpcomingEvent(e.fecha, e.estado)).length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}