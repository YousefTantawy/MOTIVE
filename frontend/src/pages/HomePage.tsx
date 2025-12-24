import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Buttons";
import { RatingStars } from "../components/ui/RatingStars";
import { useNavigate } from "react-router-dom";
import { courseService, Course } from "../services/courseService";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await courseService.getCourses();
        setCourses(data);
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
        <Card key={course.id}>
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{ width: "100%", borderRadius: "6px", marginBottom: "8px" }}
            />
          )}
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p style={{ fontSize: "13px", color: "#888" }}>
            Instructor: {course.instructor} | Price: ${course.price}
          </p>
          <RatingStars rating={course.rating ?? 4} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
            <Button onClick={() => navigate(`/course/${course.id}`)}>View Course</Button>
          </div>
        </Card>
      ))}
    </main>
  );
};
