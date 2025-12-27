import React from "react";

interface RatingStarsProps {
  rating: number; // average rating, e.g., 4.2
  max?: number; // default 5
  size?: number; // px
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 16,
}) => {
  const percentage = (rating / max) * 100;

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        fontSize: size,
        lineHeight: 1,
        color: "#ddd", // empty stars
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
          width: `${percentage}%`,
          whiteSpace: "nowrap",
          color: "#FFD700", // filled stars color
        }}
      >
        {"★★★★★"}
      </div>
      <div>{"★★★★★"}</div>
    </div>
  );
};
