import React from "react";
import { Link } from "react-router-dom";

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

interface CourseSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({ lessons, currentLessonId }) => (
  <div
    style={{
      backgroundColor: "#f5f5f5",
      padding: "16px",
      borderRadius: "8px",
      maxHeight: "600px",
      overflowY: "auto",
    }}
  >
    <h3>Lessons</h3>
    {lessons.map((lesson) => (
      <div
        key={lesson.id}
        style={{
          padding: "12px",
          marginBottom: "8px",
          backgroundColor: lesson.id === currentLessonId ? "#4f46e5" : "#fff",
          color: lesson.id === currentLessonId ? "#fff" : "#000",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <Link
          to={`/learn/${lesson.id}`}
          style={{ textDecoration: "none", color: "inherit", display: "flex", justifyContent: "space-between" }}
        >
          <span>{lesson.title}</span>
          {lesson.completed && <span>✓</span>}
        </Link>
      </div>
    ))}
  </div>
);
