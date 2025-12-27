// RatingStars.tsx
import React from "react";

interface Props {
  fractions: number[]; // [1, 1, 0.5, 0, 0]
  size?: number;
}

export const RatingStars: React.FC<Props> = ({ fractions, size = 20 }) => {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {fractions.map((f, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            background: `linear-gradient(to right, gold ${f * 100}%, #ddd ${f * 100}%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: size,
            lineHeight: 1,
          }}
        >
          ★
        </div>
      ))}
    </div>
  );
};
