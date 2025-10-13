import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import DashboardCards from "./components/DashboardCards";
import ParticipationChart from "./components/ParticipationChart";
import EventsTable from "./components/EventsTable";
import EventForm from "./components/EventForm";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./styles/main.css";

function Index() {
  const [refresh, setRefresh] = useState(false);

  const handleEventAdded = () => setRefresh(!refresh);

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Header />
        <DashboardCards />
        <ParticipationChart />
        <EventForm onEventAdded={handleEventAdded} />
        <EventsTable refresh={refresh} />
      </main>
    </div>
  );
}

// Renderiza el Dashboard directamente como pantalla principal
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
