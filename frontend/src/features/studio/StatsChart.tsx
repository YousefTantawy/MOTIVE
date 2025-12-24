import React from "react";

interface StatsChartProps {
  views: number;
  earnings: number;
  students: number;
}

export const StatsChart: React.FC<StatsChartProps> = ({ views, earnings, students }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      padding: "20px",
    }}
  >
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: "bold", color: "#4f46e5" }}>{views}</div>
      <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Views</div>
    </div>
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: "bold", color: "#22c55e" }}>${earnings}</div>
      <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Earnings</div>
    </div>
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: "bold", color: "#f59e0b" }}>{students}</div>
      <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>Students</div>
    </div>
  </div>
);
