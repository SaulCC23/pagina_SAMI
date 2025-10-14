import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../services/api";

export default function ParticipationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/dashboard/participation")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // Colores para modo claro y oscuro
  const gridColor = document.body.classList.contains('dark-mode') ? '#444' : '#e0e0e0';
  const textColor = document.body.classList.contains('dark-mode') ? '#e0e0e0' : '#666';

  return (
    <div className="bg-white shadow rounded-2xl p-6 mb-8 dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 dark:text-purple-300">Historial De Eventos</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="evento" 
            stroke={textColor}
            fontSize={12}
          />
          <YAxis 
            stroke={textColor}
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: document.body.classList.contains('dark-mode') ? '#2d2d2d' : '#fff',
              borderColor: document.body.classList.contains('dark-mode') ? '#444' : '#e0e0e0',
              color: document.body.classList.contains('dark-mode') ? '#e0e0e0' : '#333'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="participacion" 
            stroke="#6366F1" 
            strokeWidth={3} 
            dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#bb86fc' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}