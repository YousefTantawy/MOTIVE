import React from "react";
import { CourseCard } from "./CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  rating: number;
  price?: number;
}

interface CourseGridProps {
  courses: Course[];
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      padding: "20px",
    }}
  >
    {courses.map((course) => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
);
