import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Card } from "../components/ui/Card";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

interface Enrollment {
  courseId: number;
  title: string;
  progress?: number; // optional if backend doesn’t provide
}

export const StudentDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId || 0;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<Enrollment[]>(`/Dashboard/user/${userId}/courses`);
        setEnrollments(
          res.map((course) => ({
            ...course,
            progress: Math.floor(Math.random() * 101), // Mocked progress, replace if API provides
          }))
        );
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId]);

  return (
    <MainLayout>
      <div style={{ maxWidth: 1000, margin: "24px auto", padding: 20 }}>
        <h2>My Courses</h2>

        {loading ? (
          <div>Loading your courses...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : enrollments.length === 0 ? (
          <p>You are not enrolled in any courses yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
              marginTop: 20,
            }}
          >
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment.courseId}
                to={`/course/${enrollment.courseId}`}
                style={{ textDecoration: "none" }}
              >
                <Card>
                  <h3>{enrollment.title}</h3>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 14, color: "#666" }}>
                      Progress: {enrollment.progress}%
                    </div>
                    <div
                      style={{
                        backgroundColor: "#e0e0e0",
                        borderRadius: 10,
                        height: 8,
                        marginTop: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#4f46e5",
                          height: "100%",
                          width: `${enrollment.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
