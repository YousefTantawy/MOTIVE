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
  isCompleted?: boolean;
  textContent?: string | null;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<CourseData>(
          `/Dashboard/${courseId}/dashboard/${userId}`
        );
        setCourse(res);
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

  // Update video watch time
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

  // Toggle lesson complete / uncomplete
  const toggleLessonComplete = async (lesson: Lesson) => {
    const isDone = lesson.isCompleted || false;
    try {
      await axiosInstance.post("/Dashboard/completeLessonCheck", {
        userId,
        courseId: Number(courseId),
        lessonId: lesson.lessonId,
        isCompleted: !isDone,
      });

      setCourse((prev) => {
        if (!prev) return prev;
        const updatedSections = prev.sections.map((sec) => ({
          ...sec,
          lessons: sec.lessons.map((l) =>
            l.lessonId === lesson.lessonId ? { ...l, isCompleted: !isDone } : l
          ),
        }));
        return { ...prev, sections: updatedSections };
      });
    } catch (err) {
      console.error("Failed to toggle lesson completion:", err);
    }
  };

  // Submit review
  const handleSubmitReview = async () => {
    try {
      await axiosInstance.post("/Dashboard/review", {
        userId,
        courseId: Number(courseId),
        rating,
        comment,
      });
      alert("Review submitted!");
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (loading) return <MainLayout><p>Loading course...</p></MainLayout>;
  if (error) return <MainLayout><p style={{ color: "red" }}>{error}</p></MainLayout>;

  return (
    <MainLayout>
      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: 20, gap: 20, position: "relative" }}>
        
        {/* Sidebar */}
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            height: `calc(100vh - 64px)`,
            width: sidebarOpen ? 300 : 0,
            borderRight: sidebarOpen ? "1px solid #ddd" : "none",
            padding: sidebarOpen ? "20px 10px" : 0,
            overflowY: "auto",
            transition: "width 0.3s ease",
            backgroundColor: "#fff",
            zIndex: 999,
          }}
        >
          {sidebarOpen && (
            <div>
              <h2 style={{ marginTop: 0 }}>{course?.courseTitle}</h2>
              {course?.sections.map((section) => (
                <div key={section.sectionId} style={{ marginBottom: 20 }}>
                  <h3>{section.title}</h3>
                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {section.lessons.map((lesson) => {
                      const isDone = lesson.isCompleted || false;
                      return (
                        <li
                          key={lesson.lessonId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "6px 10px",
                            marginBottom: 4,
                            borderRadius: 6,
                            backgroundColor:
                              currentLesson?.lessonId === lesson.lessonId ? "#e0e0ff" : "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <span onClick={() => setCurrentLesson(lesson)}>
                            {lesson.title}{" "}
                            {lesson.lastWatchedSecond > 0 && `(Resume at ${lesson.lastWatchedSecond}s)`}
                          </span>

                          {/* Custom checkbox */}
                          <div
                            onClick={(e) => { e.stopPropagation(); toggleLessonComplete(lesson); }}
                            style={{
                              width: 20,
                              height: 20,
                              border: "2px solid #646cff",
                              borderRadius: 4,
                              backgroundColor: isDone ? "#646cff" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isDone && <span style={{ color: "#fff", fontSize: 14 }}>✔</span>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            left: sidebarOpen ? 300 : 0,
            top: 64 + 100,
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
          {sidebarOpen ? "<" : ">"}
        </div>

        {/* Video + Details + Review */}
        <div style={{ flex: 1, minWidth: 400, marginLeft: sidebarOpen ? 300 : 0, transition: "margin-left 0.3s ease", display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Video */}
          {currentLesson ? (
            <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 8, overflow: "hidden", backgroundColor: "#000" }}>
              <video
                key={currentLesson.lessonId}
                src={currentLesson.videoUrl || undefined}
                controls
                autoPlay
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                onTimeUpdate={(e) => handleTimeUpdate(Math.floor((e.target as HTMLVideoElement).currentTime))}
                onEnded={handleCompleteLesson}
                ref={(video) => {
                  if (video && currentLesson.lastWatchedSecond > 0) {
                    video.currentTime = currentLesson.lastWatchedSecond;
                  }
                }}
              />
            </div>
          ) : (
            <p>Select a lesson to start learning.</p>
          )}

          {/* Course & Lesson Details */}
          <div style={{ padding: 20, backgroundColor: "#f0f0f5", borderRadius: 8 }}>
            <h3>Course Details</h3>
            <p><strong>Course:</strong> {course?.courseTitle}</p>
            <p><strong>Instructor:</strong> {course?.instructor}</p>
            <p><strong>Current Lesson:</strong> {currentLesson?.title}</p>
            <p><strong>Type:</strong> {currentLesson?.type}</p>
            {currentLesson?.textContent && <p><strong>Notes:</strong> {currentLesson.textContent}</p>}
          </div>

          {/* Review Section */}
          <div style={{ padding: 20, backgroundColor: "#f0f0f5", borderRadius: 8 }}>
            <h3>Leave a Review</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ cursor: "pointer", fontSize: 24, color: star <= rating ? "#ffc107" : "#ccc" }}
                >
                  ★
                </span>
              ))}
              <span>{rating} / 5</span>
            </div>
            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "100%", minHeight: 80, padding: 10, borderRadius: 6, border: "1px solid #ccc", marginBottom: 10 }}
            />
            <button
              onClick={handleSubmitReview}
              style={{
                padding: "10px 20px",
                backgroundColor: "#646cff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
