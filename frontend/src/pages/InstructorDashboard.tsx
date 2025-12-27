import React, { useState } from "react";
import { StudioLayout } from "../layouts/StudioLayout";
import { StatsChart } from "../features/studio/StatsChart";
import { UploadWidget } from "../features/studio/UploadWidget";

interface Section {
  title: string;
  lessons: string[];
}

export const InstructorDashboard: React.FC = () => {
  const [stats, setStats] = useState({ views: 0, earnings: 0, students: 0 });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [sections, setSections] = useState<Section[]>([{ title: "", lessons: [""] }]);

  const handleAddObjective = () => setObjectives([...objectives, ""]);
  const handleObjectiveChange = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const handleAddRequirement = () => setRequirements([...requirements, ""]);
  const handleRequirementChange = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const handleAddSection = () => setSections([...sections, { title: "", lessons: [""] }]);
  const handleSectionTitleChange = (index: number, value: string) => {
    const updated = [...sections];
    updated[index].title = value;
    setSections(updated);
  };
  const handleAddLesson = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lessons.push("");
    setSections(updated);
  };
  const handleLessonChange = (sectionIndex: number, lessonIndex: number, value: string) => {
    const updated = [...sections];
    updated[sectionIndex].lessons[lessonIndex] = value;
    setSections(updated);
  };

  const handleSaveCourse = () => {
    const courseData = {
      title,
      description,
      price: parseFloat(price) || 0,
      objectives,
      requirements,
      sections,
    };
    console.log("New course data:", courseData);
    alert("Course saved (mock)");
  };

  const mockSidebar = (
    <div>
      <h3 style={{ color: "#fff", marginBottom: "20px" }}>Dashboard Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "12px" }}>
          <a href="#new-course" style={{ color: "#fff", textDecoration: "none" }}>📚 New Course</a>
        </li>
        <li style={{ marginBottom: "12px" }}>
          <a href="#stats" style={{ color: "#fff", textDecoration: "none" }}>📊 Stats</a>
        </li>
      </ul>
    </div>
  );

  return (
    <StudioLayout sidebar={mockSidebar}>
      <h1>Instructor Dashboard</h1>

      <StatsChart views={stats.views} earnings={stats.earnings} students={stats.students} />

      <div id="new-course" style={{ marginTop: 40 }}>
        <h2>New Course</h2>

        {/* Course Title */}
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        {/* Description */}
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
            minHeight: 80,
          }}
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price (0 for free)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        {/* Objectives */}
        <h3>Objectives</h3>
        {objectives.map((obj, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Objective ${idx + 1}`}
            value={obj}
            onChange={(e) => handleObjectiveChange(idx, e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        ))}
        <button
          onClick={handleAddObjective}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #646cff",
            background: "#f0f0ff",
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          + Add Objective
        </button>

        {/* Requirements */}
        <h3>Requirements</h3>
        {requirements.map((req, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Requirement ${idx + 1}`}
            value={req}
            onChange={(e) => handleRequirementChange(idx, e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        ))}
        <button
          onClick={handleAddRequirement}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #646cff",
            background: "#f0f0ff",
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          + Add Requirement
        </button>

        {/* Sections & Lessons */}
        <h3>Sections</h3>
        {sections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder={`Section ${sIdx + 1} Title`}
              value={section.title}
              onChange={(e) => handleSectionTitleChange(sIdx, e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 8,
                borderRadius: 8,
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            {section.lessons.map((lesson, lIdx) => (
              <input
                key={lIdx}
                type="text"
                placeholder={`Lesson ${lIdx + 1} Title`}
                value={lesson}
                onChange={(e) => handleLessonChange(sIdx, lIdx, e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginBottom: 6,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                  marginLeft: 12,
                }}
              />
            ))}
            <button
              onClick={() => handleAddLesson(sIdx)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #646cff",
                background: "#f0f0ff",
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              + Add Lesson
            </button>
          </div>
        ))}
        <button
          onClick={handleAddSection}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #646cff",
            background: "#f0f0ff",
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          + Add Section
        </button>

        {/* Upload Widget */}
        <div style={{ marginTop: 20 }}>
          <h3>Upload Video Lessons</h3>
          <UploadWidget
            onUpload={(file) => {
              console.log("Uploaded:", file.name);
            }}
          />
        </div>

        {/* Save Course */}
        <button
          onClick={handleSaveCourse}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#646cff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 20,
          }}
        >
          Save Course
        </button>
      </div>
    </StudioLayout>
  );
};
