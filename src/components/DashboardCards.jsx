import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    totalEventos: 0,
    eventosPasados: 0,
    eventosFuturos: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/summary")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando estadísticas:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-cards">
      <div className="section-header">
        <h2>Resumen de Eventos SAMI</h2>
        <p>Gestión y control de eventos del sistema</p>
      </div>
      
      <div className="cards-grid">
        {/* Eventos Totales */}
        <div className="stats-card primary">
          <div className="card-icon">
            <span>📊</span>
          </div>
          <div className="card-content">
            <h3>Eventos Totales</h3>
            <p className="card-value">
              {loading ? "..." : stats.totalEventos}
            </p>
            <span className="card-description">Registrados en la base de datos</span>
          </div>
          <div className="card-badge">Total</div>
        </div>

        {/* Eventos Pasados */}
        <div className="stats-card success">
          <div className="card-icon">
            <span>✅</span>
          </div>
          <div className="card-content">
            <h3>Eventos Realizados</h3>
            <p className="card-value">
              {loading ? "..." : stats.eventosPasados}
            </p>
            <span className="card-description">Eventos ya finalizados</span>
          </div>
          <div className="card-badge">Completados</div>
        </div>

        {/* Eventos Futuros */}
        <div className="stats-card warning">
          <div className="card-icon">
            <span>📅</span>
          </div>
          <div className="card-content">
            <h3>Eventos Próximos</h3>
            <p className="card-value">
              {loading ? "..." : stats.eventosFuturos}
            </p>
            <span className="card-description">Por ejecutar</span>
          </div>
          <div className="card-badge">Próximos</div>
        </div>
      </div>
    </div>
  );
}