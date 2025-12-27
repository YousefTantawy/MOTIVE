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
    <Card
      // ⬇️ IMPORTANT — make card fill the grid cell
      className="w-full h-full"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>{title}</h3>

      <p
        style={{ fontSize: 14, color: "#555" }}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <RatingStars rating={reviews.length > 0 ? 5 : 4} />

      {/* push button to bottom */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => navigate(`/course/${courseId}`)}>
          View Course
        </Button>
      </div>
    </Card>
  );
};
