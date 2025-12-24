import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { RatingStars } from "../../components/ui/RatingStars";

interface Course {
  id: string;
  title: string;
  description: string;
  rating: number;
  price?: number;
}

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <Link to={`/course/${course.id}`} style={{ textDecoration: "none" }}>
    <Card>
      <h3>{course.title}</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>{course.description}</p>
      <RatingStars rating={Math.round(course.rating)} />
      {course.price && <div style={{ marginTop: "8px", fontWeight: "bold" }}>${course.price}</div>}
    </Card>
  </Link>
);
