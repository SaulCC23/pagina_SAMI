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

  return (
    <div className="bg-white shadow rounded-2xl p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Tendencias de Participación</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="evento" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="participacion" stroke="#6366F1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
