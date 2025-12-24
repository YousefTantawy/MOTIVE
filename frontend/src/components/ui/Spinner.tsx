import React from "react";

export const Spinner: React.FC = () => (
  <div
    style={{
      display: "inline-block",
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #4f46e5",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  >
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
