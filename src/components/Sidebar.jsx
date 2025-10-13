import "../styles/main.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">ITM</div>
      <nav>
        <ul>
          <li className="active">Dashboard</li>
          <li>Eventos</li>
          <li>Reportes</li>
          <li>Configuración</li>
        </ul>
      </nav>
    </aside>
  );
}
