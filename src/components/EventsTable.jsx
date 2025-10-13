import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/main.css";

export default function EventsTable({ refresh }) {
  const [eventos, setEventos] = useState([]);

  const fetchEventos = () => {
    api.get("/eventos")
      .then(res => setEventos(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchEventos();
  }, [refresh]);

  return (
    <div className="table-container">
      <h2>Eventos Registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Evento</th>
            <th>Fecha</th>
            <th>Ubicación</th>
            <th>Total Participantes</th>
            <th>Mujeres</th>
            <th>Hombres</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{new Date(e.fecha).toLocaleDateString()}</td>
              <td>{e.ubicacion}</td>
              <td>{e.total_participantes ?? 0}</td>
              <td>{e.mujeres ?? 0}</td>
              <td>{e.hombres ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
