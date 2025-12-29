import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { Button } from "../components/ui/Button";
import { authService } from "../services/authService";

interface CertificateResponse {
  studentName: string;
  courseName: string;
  issueDate: string;
  pdfUrl: string | null;
  uniqueCode: string;
}

const CertificatePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [data, setData] = useState<CertificateResponse | null>(null);

  useEffect(() => {
    const loadCert = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          alert("Please log in to view your certificate");
          return;
        }

        const userId = currentUser.userId;

        const res = await axiosInstance.get(
          `/Dashboard/certificate/${userId}/${courseId}`
        );
        setData(res.data || res);
      } catch (err) {
        console.error(err);
        alert("Failed to load certificate");
      }
    };

    loadCert();
  }, [courseId]);

  if (!data) return <p>Loading...</p>;

  const formattedDate = new Date(data.issueDate).toLocaleDateString();

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        border: "2px solid #ffd700",
        borderRadius: "16px",
        padding: "40px",
        textAlign: "center",
        marginTop: "30px",
        maxWidth: 700,
        marginInline: "auto",
      }}
    >
      <h1>🎉 Congratulations!</h1>

      <h2>{data.studentName}</h2>

      <p>has successfully completed</p>

      <h3>{data.courseName}</h3>

      <p style={{ marginTop: 20, fontSize: 14, color: "#666" }}>
        Issued on {formattedDate}
      </p>

      <p style={{ fontSize: 12, color: "#999" }}>
        Certificate Code: {data.uniqueCode}
      </p>

      <div style={{ marginTop: 20 }}>
        <Button
          disabled={!data.pdfUrl}
          onClick={() => data.pdfUrl && window.open(data.pdfUrl, "_blank")}
        >
          Download Certificate
        </Button>

        {!data.pdfUrl && (
          <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
            PDF not generated yet
          </p>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;
