import React, { useState } from "react";
import { StudioLayout } from "../layouts/StudioLayout";
import { UploadWidget } from "../features/studio/UploadWidget";
import { CourseBuilder } from "../features/studio/CourseBuilder";

export const InstructorDashboard: React.FC = () => {
  const [mockStats] = useState({ views: 1245, earnings: 3500, students: 420 });

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
          <a href="#upload" style={{ color: "#fff", textDecoration: "none" }}>
            ⬆️ Upload Lesson
          </a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#new-course" style={{ color: "#fff", textDecoration: "none" }}>
            🆕 New Course
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
