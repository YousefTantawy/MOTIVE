import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Card } from "../components/ui/Card";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

interface Enrollment {
  courseId: number;
  title: string;
}

interface Lesson {
  lessonId: number;
  title: string;
  type: string;
  duration: number;
  lastWatchedSecond: number;
}

interface CourseProgress {
  courseId: number;
  courseTitle: string;
  instructor: string;
  overallProgress: number;
  sections: {
    sectionId: number;
    title: string;
    lessons: Lesson[];
  }[];
}

export const StudentDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId || 0;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<Record<number, number>>({}); // courseId => overallProgress
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<Enrollment[]>(`/Dashboard/user/${userId}/courses`);
        setEnrollments(res || []);

        // Fetch individual course progress
        const progressData: Record<number, number> = {};
        await Promise.all(
          (res || []).map(async (course) => {
            const courseRes = await axiosInstance.get<CourseProgress>(
              `/Dashboard/${course.courseId}/dashboard/${userId}`
            );
            progressData[course.courseId] = courseRes.overallProgress;
          })
        );
        setProgress(progressData);
      } catch (err: any) {
        console.error("Failed to load enrollments or progress:", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId]);

  return (
    <MainLayout>
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: 20 }}>
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>Welcome to Motive</h1>

        {loading ? (
          <div style={{ textAlign: "center" }}>Loading your courses...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        ) : enrollments.length === 0 ? (
          <p style={{ textAlign: "center" }}>You are not enrolled in any courses yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
            }}
          >
            {enrollments.map((course) => (
              <Link
                key={course.courseId}
                to={`/course/${course.courseId}/video`} // navigate to CoursePage/video
                style={{ textDecoration: "none" }}
              >
                <Card>
                  <h3>{course.title}</h3>
                </Card>
              </Link>
            ))}

          </div>
        )}
      </div>
    </MainLayout>
  );
};
