import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
}) => (
  <div style={{ marginBottom: "16px" }}>
    {label && (
      <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>
        {label}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        boxSizing: "border-box",
      }}
    />
  </div>
);
