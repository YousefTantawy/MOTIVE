import React, { useState } from "react";
import { StudioLayout } from "../layouts/StudioLayout";
import { CourseBuilder } from "../features/studio/CourseBuilder";
import { StatsChart } from "../features/studio/StatsChart";
import { UploadWidget } from "../features/studio/UploadWidget";

export const InstructorDashboard: React.FC = () => {
  const [stats, setStats] = useState({ views: 0, earnings: 0, students: 0 });

  const mockSidebar = (
    <div>
      <h3 style={{ color: "#fff", marginBottom: "20px" }}>Dashboard Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "12px" }}>
          <a href="#courses" style={{ color: "#fff", textDecoration: "none" }}>
            📚 My Courses
          </a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#earnings" style={{ color: "#fff", textDecoration: "none" }}>
            💰 Earnings
          </a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#students" style={{ color: "#fff", textDecoration: "none" }}>
            👥 Students
          </a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#settings" style={{ color: "#fff", textDecoration: "none" }}>
            ⚙️ Settings
          </a>
        </li>
      </ul>
    </div>
  );

  return (
    <StudioLayout sidebar={mockSidebar}>
      <h1>Instructor Dashboard</h1>
      <StatsChart views={stats.views} earnings={stats.earnings} students={stats.students} />
      <div style={{ marginTop: "40px" }}>
        <h2>Upload Video Lesson</h2>
        <UploadWidget
          onUpload={(file) => {
            console.log("File uploaded:", file.name);
          }}
        />
      </div>
      <div style={{ marginTop: "40px" }}>
        <CourseBuilder onSave={(sections) => console.log("Saved sections:", sections)} />
      </div>
    </StudioLayout>
  );
};

