import React, { useState } from "react";
import { Spinner } from "../../components/ui/Spinner";

interface UploadWidgetProps {
  onUpload?: (file: File) => void;
}

export const UploadWidget: React.FC<UploadWidgetProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        onUpload?.(file);
        setIsUploading(false);
      }, 1000);
    }
  };

  return (
    <div
      onDragOver={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        border: isDragging ? "2px solid #4f46e5" : "2px dashed #ccc",
        borderRadius: "8px",
        padding: "40px",
        textAlign: "center",
        backgroundColor: isDragging ? "#f0f0ff" : "#fafafa",
        cursor: "pointer",
      }}
    >
      {isUploading ? (
        <>
          <Spinner />
          <p style={{ marginTop: "10px" }}>Uploading...</p>
        </>
      ) : (
        <>
          <h3>📹 Drag & Drop Your Video Here</h3>
          <p style={{ color: "#666" }}>or click to select a file</p>
        </>
      )}
    </div>
  );
};
