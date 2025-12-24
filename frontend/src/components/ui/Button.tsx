import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#4f46e5",
      color: "#fff",
      marginTop: "8px"
    }}
  >
    {children}
  </button>
);
