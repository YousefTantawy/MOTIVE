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
        // Fetch enrolled courses from backend
        const res = await axiosInstance.get<Enrollment[]>(`/Dashboard/user/${userId}/courses`);
        setEnrollments(res || []);
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
                to={`/course/${enrollment.courseId}`} // Navigate to actual course page
                style={{ textDecoration: "none" }}
              >
                <Card>
                  <h3>{enrollment.title}</h3>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
