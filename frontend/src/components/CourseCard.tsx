import React from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { RatingStars } from "./ui/RatingStars";
import { useNavigate } from "react-router-dom";

export interface CourseCardProps {
  courseId: number;
  title: string;
  description: string;
  rating?: number; // new prop
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  title,
  description,
  rating,
}) => {
  const navigate = useNavigate();

  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h3>{title}</h3>

      <p
        style={{ fontSize: "14px", color: "#555" }}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {rating !== undefined && (
        <div style={{ margin: "8px 0" }}>
          <RatingStars rating={rating} />
          <span style={{ marginLeft: 6, fontSize: 14, color: "#333" }}>
            {rating.toFixed(1)} / 5.0
          </span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
        <Button onClick={() => navigate(`/course/${courseId}`)}>
          View Course
        </Button>
      </div>
    </Card>
  );
};
