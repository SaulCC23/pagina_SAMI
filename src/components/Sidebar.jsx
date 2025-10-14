import { useState } from "react";
import "../styles/main.css";
import ITMLogo from "../assets/ITM.png";
import EventManagementModal from "./EventManagementModal";

export default function Sidebar({ onMenuChange, darkMode, onToggleDarkMode }) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", description: "Vista general del sistema" },
    { id: "eventos", label: "Gestión de Eventos", icon: "📅", description: "Crear y gestionar eventos" },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    
    if (itemId === "eventos") {
      setIsEventModalOpen(true);
    } else {
      if (typeof onMenuChange === 'function') {
        onMenuChange(itemId);
      }
    }
  };

  const handleCloseModal = () => {
    setIsEventModalOpen(false);
  };

  const handleThemeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof onToggleDarkMode === 'function') {
      onToggleDarkMode();
    }
  };

  return (
    <>
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

          <div className="nav-section">
            <span className="section-label">Preferencias</span>
            <ul className="nav-menu">
              <li className="nav-item theme-toggle-item">
                <button 
                  className="nav-item-content theme-toggle-button" 
                  onClick={handleThemeToggle}
                  type="button"
                >
                  <span className="nav-icon">{darkMode ? "☀️" : "🌙"}</span>
                  <div className="nav-text">
                    <span className="nav-label">
                      {darkMode ? "Modo Claro" : "Modo Oscuro"}
                    </span>
                    <span className="nav-description">
                      {darkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                    </span>
                  </div>
                  <div className="theme-switch">
                    <div className={`switch-slider ${darkMode ? 'active' : ''}`}>
                      <div className="switch-knob"></div>
                    </div>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <EventManagementModal 
        isOpen={isEventModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}