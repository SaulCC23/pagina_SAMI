import { useState, useEffect } from "react";
import DashboardCards from "../components/DashboardCards";
import ParticipationChart from "../components/ParticipationChart";
import EventsTable from "../components/EventsTable";
import EventForm from "../components/EventForm";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/main.css";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log("🎨 Modo oscuro cambiado a:", darkMode);
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    console.log("📋 Clases del body:", document.body.className);
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log("🔄🔄🔄 toggleDarkMode EJECUTADO DESDE DASHBOARD");
    setDarkMode(prev => !prev);
  };

  const handleEventAdded = () => {
    setRefresh(!refresh);
  };

  // LOG DE DEBUG
  console.log("🏠 DASHBOARD renderizado con:", { darkMode, toggleDarkMode: typeof toggleDarkMode });

  return (
    <div className={`layout ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Sidebar 
        onMenuChange={(menu) => console.log("Menu cambió:", menu)} 
        darkMode={darkMode} 
        onToggleDarkMode={toggleDarkMode} 
      />
      <main className="content">
        <Header 
          darkMode={darkMode} 
          onToggleDarkMode={toggleDarkMode} 
        />
        <DashboardCards />
        <ParticipationChart />
        <EventForm onEventAdded={handleEventAdded} />
        <EventsTable refresh={refresh} />
        
        
      </main>
    </div>
  );
}