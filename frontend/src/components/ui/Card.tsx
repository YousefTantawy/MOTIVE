import React from "react";

interface CardProps {
  children: React.ReactNode;
}
export const Card: React.FC<CardProps> = ({ children }) => (
  <div style={{
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",   // content at top
    alignItems: "stretch",
    height: "auto"                   // card shrinks to fit content
  }}>
    {children}
  </div>
);

