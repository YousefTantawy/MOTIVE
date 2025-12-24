import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Card } from "../components/ui/Card";
import { enrollmentService } from "../services/enrollmentService";

export const StudentDashboard: React.FC = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        // Mock data for now
        const mockEnrollments = [
          { id: "1", courseId: "1", title: "React for Beginners", progress: 45, rating: 5 },
          { id: "2", courseId: "2", title: "Advanced TypeScript", progress: 20, rating: 4 },
        ];
        setEnrollments(mockEnrollments);
      } catch (error) {
        console.error("Failed to load enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <MainLayout>
      <div>
        <h2>My Courses</h2>
        {loading ? (
          <div>Loading your courses...</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {enrollments.map((enrollment) => (
              <Link key={enrollment.id} to={`/learn/${enrollment.courseId}`} style={{ textDecoration: "none" }}>
                <Card>
                  <h3>{enrollment.title}</h3>
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ fontSize: "14px", color: "#666" }}>Progress: {enrollment.progress}%</div>
                    <div
                      style={{
                        backgroundColor: "#e0e0e0",
                        borderRadius: "10px",
                        height: "8px",
                        marginTop: "8px",
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
