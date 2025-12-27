import React, { useState, useEffect } from "react";
import { StudioLayout } from "../layouts/StudioLayout";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const InstructorDashboard: React.FC = () => {
  const [stats, setStats] = useState({ views: 1245, earnings: 3500, students: 420 });

  // Mock graph data
  const graphData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Views",
        data: [200, 300, 250, 400, 350, 500],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.1)",
      },
      {
        label: "Earnings ($)",
        data: [500, 700, 600, 900, 850, 1100],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Earnings / Views Graph" },
    },
  };

  const mockSidebar = (
    <div>
      <h3 style={{ color: "#fff", marginBottom: "20px" }}>Dashboard Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "12px" }}>
          <a href="#courses" style={{ color: "#fff", textDecoration: "none" }}>📚 My Courses</a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#earnings" style={{ color: "#fff", textDecoration: "none" }}>💰 Earnings</a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#students" style={{ color: "#fff", textDecoration: "none" }}>👥 Students</a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#settings" style={{ color: "#fff", textDecoration: "none" }}>⚙️ Settings</a>
        </li>
      </ul>
    </div>
  );

  return (
    <StudioLayout sidebar={mockSidebar}>
      <h1>Instructor Dashboard</h1>

      {/* Top Stats Cards */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#4f46e5" }}>{stats.views}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>Views</div>
        </div>
        <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#22c55e" }}>${stats.earnings}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>Earnings</div>
        </div>
        <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#f59e0b" }}>{stats.students}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>Students</div>
        </div>
      </div>

      {/* Graph */}
      <div style={{ marginTop: 40 }}>
        <Line data={graphData} options={graphOptions} />
      </div>

      {/* Best Selling / Predicted Courses */}
      <div style={{ marginTop: 40 }}>
        <h2>Best Selling Courses</h2>
        <ul>
          <li>React Bootcamp - 120 students</li>
          <li>Python Mastery - 95 students</li>
          <li>Data Science 101 - 80 students</li>
        </ul>
      </div>
    </StudioLayout>
  );
};
