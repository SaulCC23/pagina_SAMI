import { useState } from "react";
import "../styles/main.css";
import ITMLogo from "../assets/ITM.png";

export default function Sidebar({ onMenuChange }) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", description: "Vista general del sistema" },
    { id: "eventos", label: "Gestión de Eventos", icon: "📅", description: "Crear y gestionar eventos" },
    { id: "reportes", label: "Reportes", icon: "📈", description: "Reportes y análisis" },
    { id: "participantes", label: "Participantes", icon: "👥", description: "Gestión de asistentes" },
    { id: "configuracion", label: "Configuración", icon: "⚙️", description: "Ajustes del sistema" }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (onMenuChange) {
      onMenuChange(itemId);
    }
  };

  return (
    <aside className="sidebar-enhanced">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-image-container">
            <img src={ITMLogo} alt="Logo ITM" className="logo-image" />
          </div>
          <div className="logo-text">
            <span className="logo-primary">SAMI</span>
            <span className="logo-subtitle">Sistema Autónomo</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="section-label">Navegación Principal</span>
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li 
                key={item.id}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="nav-item-content">
                  <span className="nav-icon">{item.icon}</span>
                  <div className="nav-text">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </div>
                <div className="nav-indicator"></div>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer eliminado según solicitud */}
    </aside>
  );
}