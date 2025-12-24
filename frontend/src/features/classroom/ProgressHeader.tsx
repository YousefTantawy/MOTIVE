import React from "react";

interface ProgressHeaderProps {
  progress: number;
  lessonTitle: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ progress, lessonTitle }) => (
  <div style={{ marginBottom: "20px" }}>
    <h1>{lessonTitle}</h1>
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div
        style={{
          backgroundColor: "#e0e0e0",
          borderRadius: "10px",
          height: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#4f46e5",
            height: "100%",
            width: `${progress}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  </div>
);
