import React, { useState, useEffect } from "react";
import { StudioLayout } from "../layouts/StudioLayout";
import axiosInstance from "../lib/axios";
import { authService } from "../services/authService";

interface Stats {
  views: number;
  earnings: number;
  totalCourses: number;
}

type TabType = "statistics" | "my-courses" | "create-course";

export const InstructorDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId || 0;
  
  const [activeTab, setActiveTab] = useState<TabType>("statistics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [revenue, setRevenue] = useState<number>(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [revenueRes, coursesRes] = await Promise.all([
          axiosInstance.get(`/Studio/myrevenue/${userId}`),
          axiosInstance.get(`/Studio/ownedcourses/${userId}`)
        ]);
        setRevenue(revenueRes.totalRevenue || 0);
        setCourses(coursesRes || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  // Create Course Form State
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    language: "",
    objectives: [""],
    requirements: [""],
    targetAudience: [""],
    videoFile: null as File | null,
  });

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

  const handleArrayChange = (field: "objectives" | "requirements" | "targetAudience", index: number, value: string) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "objectives" | "requirements" | "targetAudience") => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: "objectives" | "requirements" | "targetAudience", index: number) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setNewCourse((prev) => ({ ...prev, videoFile: file }));
    } else {
      alert("Please drop a video file");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "statistics":
        return (
          <div>
            <h1>Statistics</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <section style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
                <StatsCard label="Total Revenue ($)" value={revenue.toFixed(2)} />
                <StatsCard label="Total Courses" value={courses.length} />
                <StatsCard label="Total Students" value={courses.reduce((sum, c) => sum + (c.studentCount || 0), 0)} />
              </section>
            )}
          </div>
        );

      case "my-courses":
        return (
          <div>
            <h1>My Courses</h1>
            {loading ? (
              <p>Loading...</p>
            ) : courses.length === 0 ? (
              <p>No courses yet. Create your first course!</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.courseId}
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 20,
                    borderRadius: 12,
                    marginBottom: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3>{course.title}</h3>
                  <div style={{ marginTop: 10 }}>
                    <strong>Price:</strong> ${course.price}
                  </div>
                  <div>
                    <strong>Students:</strong> {course.studentCount}
                  </div>
                  <button
                    style={{
                      marginTop: 10,
                      padding: "8px 16px",
                      backgroundColor: "#646cff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => console.log("Edit course", course.courseId)}
                  >
                    Edit Course
                  </button>
                </div>
              ))
            )}
          </div>
        );

      case "create-course":
        return (
          <div>
            <h1>Create New Course</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <input
                type="text"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
              />
              <input
                type="text"
                placeholder="Category"
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
              />
              <textarea
                placeholder="Course Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc", minHeight: "100px" }}
              />
              <input
                type="text"
                placeholder="Language"
                value={newCourse.language}
                onChange={(e) => setNewCourse({ ...newCourse, language: e.target.value })}
                style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
              />
              <input
                type="number"
                placeholder="Price ($)"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
              />

              {/* Objectives */}
              <div>
                <h3>Learning Objectives</h3>
                {newCourse.objectives.map((obj, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Objective"
                      value={obj}
                      onChange={(e) => handleArrayChange("objectives", idx, e.target.value)}
                      style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
                    />
                    <button
                      onClick={() => removeArrayItem("objectives", idx)}
                      style={{ padding: "8px 12px", backgroundColor: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("objectives")}
                  style={{ padding: "8px 12px", backgroundColor: "#646cff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                >
                  + Add Objective
                </button>
              </div>

              {/* Requirements */}
              <div>
                <h3>Requirements</h3>
                {newCourse.requirements.map((req, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Requirement"
                      value={req}
                      onChange={(e) => handleArrayChange("requirements", idx, e.target.value)}
                      style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
                    />
                    <button
                      onClick={() => removeArrayItem("requirements", idx)}
                      style={{ padding: "8px 12px", backgroundColor: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("requirements")}
                  style={{ padding: "8px 12px", backgroundColor: "#646cff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                >
                  + Add Requirement
                </button>
              </div>

              {/* Target Audience */}
              <div>
                <h3>Target Audience</h3>
                {newCourse.targetAudience.map((aud, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Target Audience"
                      value={aud}
                      onChange={(e) => handleArrayChange("targetAudience", idx, e.target.value)}
                      style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
                    />
                    <button
                      onClick={() => removeArrayItem("targetAudience", idx)}
                      style={{ padding: "8px 12px", backgroundColor: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("targetAudience")}
                  style={{ padding: "8px 12px", backgroundColor: "#646cff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                >
                  + Add Target Audience
                </button>
              </div>

              {/* Video Upload Drag & Drop */}
              <div>
                <h3>Course Introduction Video</h3>
                <div
                  onDrop={handleVideoDrop}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    border: "2px dashed #ccc",
                    borderRadius: 6,
                    padding: 40,
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    cursor: "pointer",
                  }}
                >
                  {newCourse.videoFile ? (
                    <p>Video: {newCourse.videoFile.name}</p>
                  ) : (
                    <p>Drag & drop a video file here</p>
                  )}
                </div>
              </div>

              <button
                style={{
                  padding: "12px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
                onClick={() => console.log("Creating course:", newCourse)}
              >
                Create Course
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <StudioLayout>
      <div style={{ display: "flex", height: "100%", position: "relative" }}>
        {/* Sidebar */}
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 64,
            width: sidebarOpen ? 250 : 0,
            height: "calc(100vh - 64px)",
            backgroundColor: "#2c2c2c",
            color: "#fff",
            overflowY: "auto",
            overflowX: "hidden",
            transition: "width 0.3s ease",
            zIndex: 999,
            boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
          }}
        >
          {sidebarOpen && (
            <div style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0, fontSize: 20 }}>Instructor Dashboard</h2>
              <button
                onClick={() => setActiveTab("statistics")}
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 10,
                  backgroundColor: activeTab === "statistics" ? "#646cff" : "transparent",
                  color: "#fff",
                  border: "1px solid #555",
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                📊 Statistics
              </button>
              <button
                onClick={() => setActiveTab("my-courses")}
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 10,
                  backgroundColor: activeTab === "my-courses" ? "#646cff" : "transparent",
                  color: "#fff",
                  border: "1px solid #555",
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                📚 My Courses
              </button>
              <button
                onClick={() => setActiveTab("create-course")}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: activeTab === "create-course" ? "#646cff" : "transparent",
                  color: "#fff",
                  border: "1px solid #555",
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                ➕ Create Course
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            left: sidebarOpen ? 250 : 0,
            top: 164,
            width: 40,
            height: 40,
            backgroundColor: "#646cff",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: 6,
            transition: "left 0.3s ease",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          {sidebarOpen ? "◀" : "▶"}
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            marginLeft: sidebarOpen ? 250 : 0,
            padding: 40,
            transition: "margin-left 0.3s ease",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </StudioLayout>
  );
};
