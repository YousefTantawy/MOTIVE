import React from "react";
import { Button } from "../../components/ui/Button";

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

export const Certificate: React.FC<CertificateProps> = ({
  studentName,
  courseName,
  completionDate,
  certificateId,
}) => (
  <div
    style={{
      backgroundColor: "#f9f9f9",
      border: "2px solid #ffd700",
      borderRadius: "8px",
      padding: "40px",
      textAlign: "center",
      marginTop: "20px",
    }}
  >
    <h1>🎉 Congratulations!</h1>
    <h2>{studentName}</h2>
    <p>has successfully completed</p>
    <h3>{courseName}</h3>
    <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
      Completed on {completionDate}
    </p>
    <p style={{ fontSize: "12px", color: "#999" }}>Certificate ID: {certificateId}</p>
    <div style={{ marginTop: "20px" }}>
      <Button>Download Certificate</Button>
    </div>
  </div>
);
