import "../styles/main.css";
import logo from "../assets/ITM.png";

export default function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo-title">
          <img src={logo} alt="Logo ITM" className="header-logo" />
          <div className="header-title">
            <h1>Sistema Autónomo de Monitoreo Inteligente</h1>
            <p className="header-subtitle">Monitoreo en tiempo real - Control y análisis de datos</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="status-indicator">
            <span className="status-dot active"></span>
            <span>Sistema activo</span>
          </div>
        </div>
      </div>
    </header>
  );
}