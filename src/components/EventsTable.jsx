import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/main.css";

export default function EventsTable({ refresh }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = () => {
    setLoading(true);
    api.get("/eventos")
      .then(res => {
        setEventos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEventos();
  }, [refresh]);

  // Función para formatear números
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  // Función para determinar si un evento es próximo
  const isUpcomingEvent = (fecha) => {
    const eventDate = new Date(fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  return (
    <div className="table-enhanced">
      <div className="table-header">
        <div className="table-title">
          <h2>Eventos Registrados</h2>
          <p>Lista completa de eventos en el sistema SAMI</p>
        </div>
        <div className="table-stats">
          <span className="stat-badge">
            Total: {eventos.length} evento{eventos.length !== 1 ? 's' : ''}
          </span>
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
            <div className="empty-icon">📊</div>
            <h3>No hay eventos registrados</h3>
            <p>Los eventos que agregues aparecerán aquí</p>
          </div>
        ) : (
          <table className="enhanced-table">
            <thead>
              <tr>
                <th className="event-name">
                  <span className="th-content">
                    <span className="th-icon">🏷️</span>
                    Evento
                  </span>
                </th>
                <th className="event-date">
                  <span className="th-content">
                    <span className="th-icon">📅</span>
                    Fecha
                  </span>
                </th>
                <th className="event-location">
                  <span className="th-content">
                    <span className="th-icon">📍</span>
                    Ubicación
                  </span>
                </th>
                <th className="event-participants">
                  <span className="th-content">
                    <span className="th-icon">👥</span>
                    Total
                  </span>
                </th>
                <th className="event-gender">
                  <span className="th-content">
                    <span className="th-icon">♀</span>
                    Mujeres
                  </span>
                </th>
                <th className="event-gender">
                  <span className="th-content">
                    <span className="th-icon">♂</span>
                    Hombres
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id} className={isUpcomingEvent(e.fecha) ? 'upcoming-event' : ''}>
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
                      {isUpcomingEvent(e.fecha) && (
                        <span className="upcoming-badge">Próximo</span>
                      )}
                    </div>
                  </td>
                  <td className="event-location">
                    {e.ubicacion || <span className="no-data">No especificado</span>}
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
            </span>
            <span className="upcoming-count">
              • {eventos.filter(e => isUpcomingEvent(e.fecha)).length} próximo{eventos.filter(e => isUpcomingEvent(e.fecha)).length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}