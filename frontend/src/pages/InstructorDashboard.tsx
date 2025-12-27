import React, { useState } from "react";
import { StudioLayout } from "../layouts/StudioLayout";
import { UploadWidget } from "../features/studio/UploadWidget";
import { CourseBuilder } from "../features/studio/CourseBuilder";

interface Stats {
  views: number;
  earnings: number;
  totalCourses: number;
}

export const InstructorDashboard: React.FC = () => {
  // Mock stats
  const [mockStats] = useState<Stats>({ views: 1245, earnings: 3500, totalCourses: 12 });

  // Stats Card Component
  const StatsCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div
      style={{
        flex: 1,
        padding: "20px",
        backgroundColor: "#f0f0f5",
        borderRadius: 8,
        textAlign: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "18px", color: "#555" }}>{label}</h3>
      <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{value}</p>
    </div>
  );

  return (
    <StudioLayout>
      {/* Stats Section */}
      <section style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <StatsCard label="Total Views" value={mockStats.views} />
        <StatsCard label="Earnings ($)" value={mockStats.earnings} />
        <StatsCard label="Total Courses" value={mockStats.totalCourses} />
      </section>

      {/* My Courses Section */}
      <section id="courses">
        <h1>My Courses</h1>
        <CourseBuilder onSave={(sections) => console.log("Saved sections:", sections)} />
      </section>

      {/* Upload Lesson Section */}
      <section id="upload" style={{ marginTop: "40px" }}>
        <h2>Upload Video Lesson</h2>
        <UploadWidget onUpload={(file) => console.log("File uploaded:", file.name)} />
      </section>

      {/* New Course Section */}
      <section id="new-course" style={{ marginTop: "40px" }}>
        <h2>Create New Course</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="Course Title"
            style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Category"
            style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
          />
          <textarea
            placeholder="Course Description"
            style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc", minHeight: "100px" }}
          />
          <input
            type="number"
            placeholder="Price ($)"
            style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button
            style={{
              padding: "10px",
              backgroundColor: "#646cff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
            onClick={() => console.log("New course created")}
          >
            Save New Course
          </button>
        </div>
      </section>
    </StudioLayout>
  );
};
