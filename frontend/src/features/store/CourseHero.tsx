import React from "react";
import { Button } from "../../components/ui/Button";

interface CourseHeroProps {
  title: string;
  description: string;
  instructor: string;
  rating: number;
  price: number;
  onEnroll?: () => void;
}

export const CourseHero: React.FC<CourseHeroProps> = ({
  title,
  description,
  instructor,
  rating,
  price,
  onEnroll,
}) => (
  <div
    style={{
      backgroundColor: "#1a1a1a",
      color: "#fff",
      padding: "40px",
      borderRadius: "8px",
      marginBottom: "20px",
    }}
  >
    <h1>{title}</h1>
    <p style={{ fontSize: "18px", marginBottom: "10px" }}>{description}</p>
    <div style={{ marginBottom: "20px" }}>
      <span>Instructor: {instructor}</span>
      <span style={{ marginLeft: "20px" }}>Rating: {rating}/5</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <h2>${price}</h2>
      <Button onClick={onEnroll}>Enroll Now</Button>
    </div>
  </div>
);
