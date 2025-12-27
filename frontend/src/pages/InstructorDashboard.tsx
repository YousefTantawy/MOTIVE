import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { StudioLayout } from "../layouts/StudioLayout";
import { StatsChart } from "../features/studio/StatsChart";

export const InstructorDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    views: 1245,
    earnings: 3500,
    students: 420,
  });

  const mockSidebar = (
    <div>
      <h3 style={{ color: "#fff", marginBottom: 20 }}>Dashboard Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: 12 }}>
          <a href="/instructor" style={{ color: "#fff", textDecoration: "none" }}>📊 Stats</a>
        </li>
        <li style={{ marginBottom: 12 }}>
          <a href="/instructor/new-course" style={{ color: "#fff", textDecoration: "none" }}>📚 New Course</a>
        </li>
      </ul>
    </div>
  );

  return (
    <StudioLayout sidebar={mockSidebar}>
      <h1>Instructor Dashboard</h1>
      <StatsChart views={stats.views} earnings={stats.earnings} students={stats.students} />

      <div style={{ marginTop: 40 }}>
        <h2>Best Selling Course</h2>
        <p>Course Name: React Mastery</p>
        <p>Enrolled Students: 120</p>
        <p>Earnings: $1200</p>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2>Predictions</h2>
        <p>Projected earnings next month: $1500</p>
        <p>Projected views next month: 2,000</p>
      </div>

      {/* Here you could add more charts: daily/weekly/monthly/yearly earnings */}
      <div style={{ marginTop: 40 }}>
        <h2>Earnings / Views Graph</h2>
        <StatsChart views={stats.views} earnings={stats.earnings} students={stats.students} />
      </div>

      {/* Outlet for nested routes like new course */}
      <Outlet />
    </StudioLayout>
  );
};
