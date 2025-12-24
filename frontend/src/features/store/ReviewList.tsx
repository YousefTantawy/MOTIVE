import React from "react";
import { Card } from "../../components/ui/Card";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => (
  <div style={{ marginTop: "20px" }}>
    <h2>Reviews</h2>
    {reviews.map((review) => (
      <Card key={review.id}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>{review.author}</strong>
          <span style={{ fontSize: "12px", color: "#999" }}>{review.date}</span>
        </div>
        <div style={{ marginTop: "8px", color: "#facc15" }}>★ {review.rating}/5</div>
        <p style={{ marginTop: "8px" }}>{review.text}</p>
      </Card>
    ))}
  </div>
);
