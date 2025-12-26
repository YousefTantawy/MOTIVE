import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { RatingStars } from "../components/ui/RatingStars";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";

export interface Course {
  courseId: number;
  title: string;
  description: string;
  reviews: string[];
}

interface HomeCoursesResponse {
  trending: Course[];
  topRated: Course[];
  newest: Course[];
  bestSellers: Course[];
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await axiosInstance.get<HomeCoursesResponse>("/Courses");

        // 👈 pick which list to show (currently trending)
        setCourses(data.trending);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error) return <p style={{ padding: 40 }}>{error}</p>;

  return (
    <main
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        padding: "40px",
      }}
    >
      {courses.map((course) => (
        <Card key={course.courseId}>
          <h3>{course.title}</h3>

          <p
            style={{ fontSize: "14px", color: "#555" }}
            dangerouslySetInnerHTML={{ __html: course.description }}
          />

          <RatingStars rating={course.reviews.length > 0 ? 5 : 4} />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "auto",
            }}
          >
            <Button onClick={() => navigate(`/course/${course.courseId}`)}>
              View Course
            </Button>
          </div>
        </Card>
      ))}
    </main>
  );
};
