import React from "react";

interface RatingProps { rating: number; }

export const RatingStars: React.FC<RatingProps> = ({ rating }) => {
  const stars = Array.from({length: 5}, (_, i) => i < rating ? "★" : "☆");
  return <span style={{ color: "#facc15" }}>{stars.join("")}</span>;
};
