import { useState } from "react";
import DashboardCards from "../components/DashboardCards";
import ParticipationChart from "../components/ParticipationChart";
import EventsTable from "../components/EventsTable";
import EventForm from "../components/EventForm";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/main.css";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  const handleEventAdded = () => {
    // cambia el estado para actualizar la tabla automáticamente
    setRefresh(!refresh);
  };

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
