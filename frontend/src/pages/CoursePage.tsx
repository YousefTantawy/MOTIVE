import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import axiosInstance from "../lib/axios";
import { authService } from "../services/authService";

interface Lesson {
  lessonId: number;
  title: string;
  type: string;
  videoUrl: string | null;
  duration: number;
  lastWatchedSecond: number;
}

interface Section {
  sectionId: number;
  title: string;
  lessons: Lesson[];
}

interface CourseData {
  courseId: number;
  courseTitle: string;
  instructor: string;
  overallProgress: number;
  sections: Section[];
}

export const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const userId = authService.getCurrentUser()?.userId || 0;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<CourseData>(
          `/Dashboard/${courseId}/dashboard/${userId}`
        );
        setCourse(res);
        // Auto-select first lesson
        const firstLesson = res.sections[0]?.lessons[0] || null;
        setCurrentLesson(firstLesson);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load course. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, userId]);

  // Handle video time updates
  const handleTimeUpdate = async (seconds: number) => {
    if (!currentLesson) return;
    try {
      await axiosInstance.post("/Dashboard/updateWatchTime", {
        userId,
        courseId: Number(courseId),
        lessonId: currentLesson.lessonId,
        seconds,
      });
    } catch (err) {
      console.error("Failed to update watch time:", err);
    }
  };

  // Handle marking lesson complete
  const handleCompleteLesson = async () => {
    if (!currentLesson) return;
    try {
      await axiosInstance.post("/Dashboard/completeLessonCheck", {
        userId,
        courseId: Number(courseId),
        lessonId: currentLesson.lessonId,
        isCompleted: true,
      });
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }
  };

  if (loading) return <MainLayout><p>Loading course...</p></MainLayout>;
  if (error) return <MainLayout><p style={{ color: "red" }}>{error}</p></MainLayout>;

  return (
    <MainLayout>
      <div style={{ display: "flex", gap: 20, maxWidth: 1100, margin: "0 auto", padding: 20 }}>
        {/* Lessons / Sections */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <h2>{course?.courseTitle}</h2>
          {course?.sections.map((section) => (
            <div key={section.sectionId} style={{ marginBottom: 20 }}>
              <h3>{section.title}</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {section.lessons.map((lesson) => (
                  <li
                    key={lesson.lessonId}
                    style={{
                      padding: "8px 12px",
                      marginBottom: 4,
                      cursor: "pointer",
                      backgroundColor: currentLesson?.lessonId === lesson.lessonId ? "#e0e0ff" : "transparent",
                      borderRadius: 4,
                    }}
                    onClick={() => setCurrentLesson(lesson)}
                  >
                    {lesson.title} {lesson.lastWatchedSecond > 0 && `(Resume at ${lesson.lastWatchedSecond}s)`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div style={{ flex: 1 }}>
          {currentLesson ? (
            <video
              key={currentLesson.lessonId}
              src={currentLesson.videoUrl || undefined}
              controls
              autoPlay
              width="100%"
              onTimeUpdate={(e) =>
                handleTimeUpdate(Math.floor((e.target as HTMLVideoElement).currentTime))
              }
              onEnded={handleCompleteLesson}
            />
          ) : (
            <p>Select a lesson to start learning.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
