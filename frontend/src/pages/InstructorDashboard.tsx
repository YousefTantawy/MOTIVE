import React, { useState, useEffect } from "react";
import { StudioLayout } from "../layouts/StudioLayout";
import axiosInstance from "../lib/axios";
import { authService } from "../services/authService";

interface Resource {
  name: string;
  url: string;
}

interface Lesson {
  title: string;
  contentType: string;
  videoUrl: string;
  textContent: string;
  durationSeconds: number;
  isPreviewable: boolean;
  orderIndex: number;
  resources: Resource[];
}

interface Section {
  title: string;
  objective: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface CreateCoursePayload {
  instructorId: number;
  title: string;
  price: number;
  thumbnailUrl: string;
  difficultyLevel: string;
  language: string;
  categoryIds: number[];
  fullDescription: string;
  objectives: string[];
  requirements: string[];
  targetAudiences: string[];
  sections: Section[];
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
  const [categories, setCategories] = useState<{catId: number; name: string}[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [revenueRes, coursesRes, categoriesRes] = await Promise.all([
          axiosInstance.get(`/Studio/myrevenue/${userId}`),
          axiosInstance.get(`/Studio/ownedcourses/${userId}`),
          axiosInstance.get(`/Studio/categories`)
        ]);
        setRevenue(revenueRes.totalRevenue || 0);
        setCourses(coursesRes || []);
        setCategories(categoriesRes || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  // Create Course Form State
  const [newCourse, setNewCourse] = useState<CreateCoursePayload>({
    instructorId: userId,
    title: "",
    price: 0,
    thumbnailUrl: "",
    difficultyLevel: "Beginner",
    language: "English",
    categoryIds: [],
    fullDescription: "",
    objectives: [""],
    requirements: [""],
    targetAudiences: [""],
    sections: [
      {
        title: "",
        objective: "",
        orderIndex: 0,
        lessons: [
          {
            title: "",
            contentType: "Video",
            videoUrl: "",
            textContent: "",
            durationSeconds: 0,
            isPreviewable: false,
            orderIndex: 0,
            resources: [],
          },
        ],
      },
    ],
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

  const handleBasicFieldChange = (field: keyof Omit<CreateCoursePayload, 'sections' | 'objectives' | 'requirements' | 'targetAudiences'>, value: any) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "objectives" | "requirements" | "targetAudiences",
    index: number,
    value: string
  ) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "objectives" | "requirements" | "targetAudiences") => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "objectives" | "requirements" | "targetAudiences",
    index: number
  ) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addSection = () => {
    setNewCourse((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          objective: "",
          orderIndex: prev.sections.length,
          lessons: [
            {
              title: "",
              contentType: "Video",
              videoUrl: "",
              textContent: "",
              durationSeconds: 0,
              isPreviewable: false,
              orderIndex: 0,
              resources: [],
            },
          ],
        },
      ],
    }));
  };

  const removeSection = (sectionIndex: number) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sectionIndex),
    }));
  };

  const updateSection = (sectionIndex: number, field: string, value: any) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex ? { ...sec, [field]: value } : sec
      ),
    }));
  };

  const addLesson = (sectionIndex: number) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              lessons: [
                ...sec.lessons,
                {
                  title: "",
                  contentType: "Video",
                  videoUrl: "",
                  textContent: "",
                  durationSeconds: 0,
                  isPreviewable: false,
                  orderIndex: sec.lessons.length,
                  resources: [],
                },
              ],
            }
          : sec
      ),
    }));
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              lessons: sec.lessons.filter((_, j) => j !== lessonIndex),
            }
          : sec
      ),
    }));
  };

  const updateLesson = (
    sectionIndex: number,
    lessonIndex: number,
    field: string,
    value: any
  ) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              lessons: sec.lessons.map((lesson, j) =>
                j === lessonIndex ? { ...lesson, [field]: value } : lesson
              ),
            }
          : sec
      ),
    }));
  };

  const addResource = (sectionIndex: number, lessonIndex: number) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              lessons: sec.lessons.map((lesson, j) =>
                j === lessonIndex
                  ? {
                      ...lesson,
                      resources: [...lesson.resources, { name: "", url: "" }],
                    }
                  : lesson
              ),
            }
          : sec
      ),
    }));
  };

  const removeResource = (
    sectionIndex: number,
    lessonIndex: number,
    resourceIndex: number
  ) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              lessons: sec.lessons.map((lesson, j) =>
                j === lessonIndex
                  ? {
                      ...lesson,
                      resources: lesson.resources.filter(
                        (_, k) => k !== resourceIndex
                      ),
                    }
                  : lesson
              ),
            }
          : sec
      ),
    }));
  };

  const updateResource = (
    sectionIndex: number,
    lessonIndex: number,
    resourceIndex: number,
    field: string,
    value: string
  ) => {
    setNewCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              lessons: sec.lessons.map((lesson, j) =>
                j === lessonIndex
                  ? {
                      ...lesson,
                      resources: lesson.resources.map((res, k) =>
                        k === resourceIndex ? { ...res, [field]: value } : res
                      ),
                    }
                  : lesson
              ),
            }
          : sec
      ),
    }));
  };

  const handleCreateCourse = async () => {
    setCreateError("");
    setCreateLoading(true);

    try {
      // Filter out empty strings from arrays
      const payload: CreateCoursePayload = {
        ...newCourse,
        instructorId: userId,
        price: Number(newCourse.price),
        objectives: newCourse.objectives.filter((obj) => obj.trim()),
        requirements: newCourse.requirements.filter((req) => req.trim()),
        targetAudiences: newCourse.targetAudiences.filter((aud) => aud.trim()),
        sections: newCourse.sections
          .filter((sec) => sec.title.trim())
          .map((sec) => ({
            ...sec,
            lessons: sec.lessons
              .filter((les) => les.title.trim())
              .map((les, lesIdx) => ({
                ...les,
                orderIndex: lesIdx,
                durationSeconds: Number(les.durationSeconds),
              })),
          }))
          .map((sec, secIdx) => ({
            ...sec,
            orderIndex: secIdx,
          })),
      };

      const response = await axiosInstance.post<{ message: string; courseId: number }>(
        "/Studio/create",
        payload
      );

      if (response && response.message) {
        alert(`Course created successfully! Course ID: ${response.courseId}`);
        // Reset form
        setNewCourse({
          instructorId: userId,
          title: "",
          price: 0,
          thumbnailUrl: "",
          difficultyLevel: "Beginner",
          language: "English",
          categoryIds: [],
          fullDescription: "",
          objectives: [""],
          requirements: [""],
          targetAudiences: [""],
          sections: [
            {
              title: "",
              objective: "",
              orderIndex: 0,
              lessons: [
                {
                  title: "",
                  contentType: "Video",
                  videoUrl: "",
                  textContent: "",
                  durationSeconds: 0,
                  isPreviewable: false,
                  orderIndex: 0,
                  resources: [],
                },
              ],
            },
          ],
        });
        // Refresh courses list
        if (userId) {
          const coursesRes = await axiosInstance.get(
            `/Studio/ownedcourses/${userId}`
          );
          setCourses(coursesRes || []);
        }
      }
    } catch (err: any) {
      console.error("Failed to create course:", err);
      setCreateError(err.message || "Failed to create course. Please try again.");
    } finally {
      setCreateLoading(false);
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
                <StatsCard
                  label="Total Students"
                  value={courses.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
                />
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
            {createError && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "12px",
                  borderRadius: 6,
                  marginBottom: "20px",
                  border: "1px solid #f5c6cb",
                }}
              >
                {createError}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
<<<<<<< HEAD
              <input
                type="text"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
              />
              <select
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.catId} value={cat.catId}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
=======
              {/* Basic Course Info */}
              <div style={{ borderTop: "2px solid #ddd", paddingTop: "20px" }}>
                <h3>Course Information</h3>
                <input
                  type="text"
                  placeholder="Course Title *"
                  value={newCourse.title}
                  onChange={(e) => handleBasicFieldChange("title", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                    boxSizing: "border-box",
                  }}
                />
                <textarea
                  placeholder="Full Description *"
                  value={newCourse.fullDescription}
                  onChange={(e) =>
                    handleBasicFieldChange("fullDescription", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    minHeight: "100px",
                    marginBottom: "10px",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="number"
                    placeholder="Price ($) *"
                    value={newCourse.price}
                    onChange={(e) =>
                      handleBasicFieldChange("price", parseFloat(e.target.value))
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Thumbnail URL"
                    value={newCourse.thumbnailUrl}
                    onChange={(e) =>
                      handleBasicFieldChange("thumbnailUrl", e.target.value)
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <select
                    value={newCourse.language}
                    onChange={(e) => handleBasicFieldChange("language", e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                  <select
                    value={newCourse.difficultyLevel}
                    onChange={(e) =>
                      handleBasicFieldChange("difficultyLevel", e.target.value)
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Category IDs (comma separated)"
                  value={newCourse.categoryIds.join(",")}
                  onChange={(e) =>
                    handleBasicFieldChange(
                      "categoryIds",
                      e.target.value
                        .split(",")
                        .map((id) => Number(id.trim()))
                        .filter((id) => !isNaN(id))
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
>>>>>>> 1e1269ba59f8af66f6e096635d886b4a8f4acb1c

              {/* Objectives */}
              <div style={{ borderTop: "2px solid #ddd", paddingTop: "20px" }}>
                <h3>Learning Objectives</h3>
                {newCourse.objectives.map((obj, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Objective"
                      value={obj}
                      onChange={(e) => handleArrayChange("objectives", idx, e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      onClick={() => removeArrayItem("objectives", idx)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("objectives")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#646cff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  + Add Objective
                </button>
              </div>

              {/* Requirements */}
              <div style={{ borderTop: "2px solid #ddd", paddingTop: "20px" }}>
                <h3>Requirements</h3>
                {newCourse.requirements.map((req, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Requirement"
                      value={req}
                      onChange={(e) =>
                        handleArrayChange("requirements", idx, e.target.value)
                      }
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      onClick={() => removeArrayItem("requirements", idx)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("requirements")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#646cff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  + Add Requirement
                </button>
              </div>

              {/* Target Audience */}
              <div style={{ borderTop: "2px solid #ddd", paddingTop: "20px" }}>
                <h3>Target Audience</h3>
                {newCourse.targetAudiences.map((aud, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Target Audience"
                      value={aud}
                      onChange={(e) =>
                        handleArrayChange("targetAudiences", idx, e.target.value)
                      }
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      onClick={() => removeArrayItem("targetAudiences", idx)}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem("targetAudiences")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#646cff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  + Add Target Audience
                </button>
              </div>

              {/* Sections and Lessons */}
              <div style={{ borderTop: "2px solid #ddd", paddingTop: "20px" }}>
                <h3>Course Sections & Lessons</h3>
                {newCourse.sections.map((section, secIdx) => (
                  <div
                    key={secIdx}
                    style={{
                      backgroundColor: "#f0f0f5",
                      padding: "15px",
                      borderRadius: 8,
                      marginBottom: "20px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <h4>Section {secIdx + 1}</h4>
                      <button
                        onClick={() => removeSection(secIdx)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#ff4d4f",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Remove Section
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Section Title *"
                      value={section.title}
                      onChange={(e) => updateSection(secIdx, "title", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                      }}
                    />
                    <textarea
                      placeholder="Section Objective"
                      value={section.objective}
                      onChange={(e) =>
                        updateSection(secIdx, "objective", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        minHeight: "70px",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                      }}
                    />

                    {/* Lessons */}
                    <div style={{ marginLeft: "15px" }}>
                      <h5>Lessons</h5>
                      {section.lessons.map((lesson, lesIdx) => (
                        <div
                          key={lesIdx}
                          style={{
                            backgroundColor: "#fff",
                            padding: "12px",
                            borderRadius: 6,
                            marginBottom: "12px",
                            border: "1px solid #ddd",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <strong>Lesson {lesIdx + 1}</strong>
                            <button
                              onClick={() => removeLesson(secIdx, lesIdx)}
                              style={{
                                padding: "6px 10px",
                                backgroundColor: "#ff4d4f",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Lesson Title *"
                            value={lesson.title}
                            onChange={(e) =>
                              updateLesson(secIdx, lesIdx, "title", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: 4,
                              border: "1px solid #ccc",
                              marginBottom: "8px",
                              boxSizing: "border-box",
                            }}
                          />
                          <select
                            value={lesson.contentType}
                            onChange={(e) =>
                              updateLesson(secIdx, lesIdx, "contentType", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: 4,
                              border: "1px solid #ccc",
                              marginBottom: "8px",
                              boxSizing: "border-box",
                            }}
                          >
                            <option value="Video">Video</option>
                            <option value="Article">Article</option>
                            <option value="Quiz">Quiz</option>
                          </select>
                          {lesson.contentType === "Video" && (
                            <input
                              type="text"
                              placeholder="Video URL"
                              value={lesson.videoUrl}
                              onChange={(e) =>
                                updateLesson(secIdx, lesIdx, "videoUrl", e.target.value)
                              }
                              style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                marginBottom: "8px",
                                boxSizing: "border-box",
                              }}
                            />
                          )}
                          {lesson.contentType === "Article" && (
                            <textarea
                              placeholder="Text Content"
                              value={lesson.textContent}
                              onChange={(e) =>
                                updateLesson(secIdx, lesIdx, "textContent", e.target.value)
                              }
                              style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                minHeight: "60px",
                                marginBottom: "8px",
                                boxSizing: "border-box",
                              }}
                            />
                          )}
                          <input
                            type="number"
                            placeholder="Duration (seconds)"
                            value={lesson.durationSeconds}
                            onChange={(e) =>
                              updateLesson(
                                secIdx,
                                lesIdx,
                                "durationSeconds",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: 4,
                              border: "1px solid #ccc",
                              marginBottom: "8px",
                              boxSizing: "border-box",
                            }}
                          />
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "10px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={lesson.isPreviewable}
                              onChange={(e) =>
                                updateLesson(secIdx, lesIdx, "isPreviewable", e.target.checked)
                              }
                            />
                            Is Previewable
                          </label>

                          {/* Resources */}
                          <div style={{ marginTop: "10px" }}>
                            <h6 style={{ marginTop: 0 }}>Resources</h6>
                            {lesson.resources.map((resource, resIdx) => (
                              <div
                                key={resIdx}
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  marginBottom: "8px",
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Resource Name"
                                  value={resource.name}
                                  onChange={(e) =>
                                    updateResource(
                                      secIdx,
                                      lesIdx,
                                      resIdx,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "6px",
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                    fontSize: "12px",
                                  }}
                                />
                                <input
                                  type="text"
                                  placeholder="Resource URL"
                                  value={resource.url}
                                  onChange={(e) =>
                                    updateResource(
                                      secIdx,
                                      lesIdx,
                                      resIdx,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "6px",
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                    fontSize: "12px",
                                  }}
                                />
                                <button
                                  onClick={() => removeResource(secIdx, lesIdx, resIdx)}
                                  style={{
                                    padding: "6px 10px",
                                    backgroundColor: "#ff4d4f",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addResource(secIdx, lesIdx)}
                              style={{
                                padding: "6px 10px",
                                backgroundColor: "#646cff",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              + Add Resource
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addLesson(secIdx)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        + Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addSection}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#17a2b8",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  + Add Section
                </button>
              </div>

              {/* Submit Button */}
              <button
                disabled={createLoading}
                style={{
                  padding: "12px",
                  backgroundColor: createLoading ? "#ccc" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: createLoading ? "not-allowed" : "pointer",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
                onClick={handleCreateCourse}
              >
                {createLoading ? "Creating Course..." : "Create Course"}
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
                  backgroundColor:
                    activeTab === "statistics" ? "#646cff" : "transparent",
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
                  backgroundColor:
                    activeTab === "my-courses" ? "#646cff" : "transparent",
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
                  backgroundColor:
                    activeTab === "create-course" ? "#646cff" : "transparent",
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