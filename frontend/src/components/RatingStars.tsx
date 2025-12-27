import React from "react";

interface RatingStarsProps {
  rating: number; // 0–5
  size?: number; // optional size in px
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 16 }) => {
  const percentage = Math.max(0, Math.min(5, rating)) / 5 * 100;

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        fontSize: size,
        lineHeight: 1,
        color: "#ddd",
      }}
      aria-label={`Rating: ${rating.toFixed(1)} out of 5`}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>★★★★★</span>
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "hidden",
            width: `${percentage}%`,
            color: "#ffc107", // gold/yellow
            whiteSpace: "nowrap",
          }}
        >
          ★★★★★
        </span>
      </div>
    </div>
  );
};
