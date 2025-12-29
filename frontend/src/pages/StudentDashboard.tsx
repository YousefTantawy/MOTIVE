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

interface CourseProgress {
  courseId: number;
  courseTitle: string;
  instructor: string;
  overallProgress: number;
}

export const StudentDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId || 0;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get<Enrollment[]>(
          `/Dashboard/user/${userId}/courses`
        );

        setEnrollments(res || []);

        const progressData: Record<number, number> = {};
        await Promise.all(
          (res || []).map(async (course) => {
            const courseRes = await axiosInstance.get<CourseProgress>(
              `/Dashboard/${course.courseId}/dashboard/${userId}`
            );
            progressData[course.courseId] =
              courseRes?.overallProgress ?? 0;
          })
        );

        setProgress(progressData);
      } catch (err) {
        console.error(err);
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId]);

  return (
    <MainLayout>
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: 20 }}>
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          Your Courses
        </h1>

        {loading ? (
          <div style={{ textAlign: "center" }}>Loading…</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        ) : enrollments.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {enrollments.map((course) => {
              const p = progress[course.courseId] ?? 0;

              return (
                <Card key={course.courseId}>
                  <h3>{course.title}</h3>

                  <p style={{ marginTop: 8 }}>
                    Progress: <strong>{p}%</strong>
                  </p>

                  <Link
                    to={`/course/${course.courseId}/video`}
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      textDecoration: "none",
                      color: "blue",
                    }}
                  >
                    Continue Learning
                  </Link>

                  {p === 100 && (
                    <div style={{ marginTop: 12 }}>
                      <Link
                        to={`/certificate/${course.courseId}`}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #4caf50",
                          background: "#4caf50",
                          color: "#fff",
                          textDecoration: "none",
                        }}
                      >
                        🎓 View Certificate
                      </Link>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
