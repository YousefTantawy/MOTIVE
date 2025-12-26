import React from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { RatingStars } from "./ui/RatingStars";
import { useNavigate } from "react-router-dom";

export interface CourseCardProps {
  courseId: number;
  title: string;
  description: string;
  reviews?: string[];
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  title,
  description,
  reviews = []
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <h3>{title}</h3>

      <p
        style={{ fontSize: "14px", color: "#555" }}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <RatingStars rating={reviews.length > 0 ? 5 : 4} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
        <Button onClick={() => navigate(`/course/${courseId}`)}>
          View Course
        </Button>
      </div>
    </Card>
  );
};
