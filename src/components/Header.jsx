import "../styles/main.css";
import logo from "../assets/ITM.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo-title">
          <img src={logo} alt="Logo ITM" className="header-logo" />
          <div className="header-title">
            <h1>Sistema Autónomo de Monitoreo Inteligente</h1>
            </div>
        </div>
        <div className="header-actions">
          <div className="status-indicator">
            <span className="status-dot active"></span>
            </div>
          <div className="user-profile">
            <span>BIENVENIDO!</span>
            <div className="user-avatar"> <img src="../assets/ITM.png" alt="" /></div>
          </div>
        </div>
      </div>
    </header>
  );
}