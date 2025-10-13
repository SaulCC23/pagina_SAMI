import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    eventos: 0,
    participaciones: 0,
    ausencias: 0,
    recomendaciones: 0,
  });

  useEffect(() => {
    api.get("/dashboard/summary")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white shadow rounded-2xl p-5 text-center">
        <h3 className="text-gray-600 text-sm">Eventos Analizados</h3>
        <p className="text-3xl font-semibold">{stats.eventos}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-5 text-center">
        <h3 className="text-gray-600 text-sm">Participaciones Detectadas</h3>
        <p className="text-3xl font-semibold">{stats.participaciones}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-5 text-center">
        <h3 className="text-gray-600 text-sm">Tasa de Ausencias</h3>
        <p className="text-3xl font-semibold">{stats.ausencias}%</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-5 text-center">
        <h3 className="text-gray-600 text-sm">Recomendaciones Activas</h3>
        <p className="text-3xl font-semibold">{stats.recomendaciones}</p>
      </div>
    </div>
  );
}
