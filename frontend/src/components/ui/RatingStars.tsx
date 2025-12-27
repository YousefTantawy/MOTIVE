// RatingStars.tsx
import React from "react";

interface RatingStarsProps {
  fractions: number[]; // array of 5 numbers between 0 and 1
  size?: number; // optional star size
}

export const RatingStars: React.FC<RatingStarsProps> = ({ fractions, size = 16 }) => {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {fractions.map((f, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            background: `linear-gradient(to right, gold ${f * 100}%, #ddd ${f * 100}%)`,
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      ))}
    </div>
  );
};
