import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import axiosInstance from "../lib/axios";
import { authService } from "../services/authService";

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const courseId = params.get("courseId") || "";
  const price = params.get("price") || "0";

  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId || 0;

  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>("");

  console.log("Using API base URL:", import.meta.env.VITE_API_BASE_URL);

  // Fetch course title
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const res = await axiosInstance.get(`/Courses/${courseId}`);
        const title = (res as any)?.title || (res as any)?.data?.title || `Course ${courseId}`;
        setCourseTitle(title);
      } catch (err) {
        console.log("Failed to fetch course info:", err);
        setCourseTitle(`Course ${courseId}`);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleSubmit = async () => {
    if (!paymentMethod) {
      setPopup({ type: "error", message: "Please select a payment method." });
      return;
    }

    setProcessing(true);
    setPopup(null);

    // Simulate 3-second processing
    setTimeout(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Payments/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseId: parseInt(courseId), paymentMethod }),
        });

        if (res.status === 200) {
          setPopup({ type: "success", message: "Payment successful!" });
        } else if (res.status === 400) {
          setPopup({ type: "error", message: "User is already enrolled in this course." });
        } else {
          setPopup({ type: "error", message: "Payment failed. Please try again." });
        }
      } catch (err) {
        setPopup({ type: "error", message: "Payment failed. Please try again." });
      } finally {
        setProcessing(false);
      }
    }, 3000);
  };

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: 720,
          margin: "24px auto",
          padding: 20,
          background: "#f9f9f9",
          borderRadius: 10,
          position: "relative",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Complete Your Payment</h2>

        <p>
          Course: <strong>{courseTitle || `Course ${courseId}`}</strong>
        </p>
        <p>
          Amount: <strong>${price}</strong>
        </p>

        {/* Payment method buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16 }}>
          {["Fawry", "Visa", "Paypal"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                border: paymentMethod === method ? "2px solid #0a84ff" : "1px solid #ccc",
                backgroundColor: paymentMethod === method ? "#0a84ff" : "#fff",
                color: paymentMethod === method ? "#fff" : "#000",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Pay / Cancel buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={processing}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: "#0a84ff",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {processing ? "Processing..." : `Pay $${price}`}
            {processing && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 3,
                  width: "100%",
                  backgroundColor: "#fff",
                  animation: "loadingBar 3s linear",
                }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>

        {/* Popup */}
        {popup && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: popup.type === "success" ? "#4f46e5" : "#f44336",
              color: "#fff",
              padding: "30px 40px",
              borderRadius: 12,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              zIndex: 9999,
            }}
          >
            {popup.type === "success" && <span style={{ fontSize: 48, color: "#fff" }}>✔️</span>}
            <span>{popup.message}</span>
          </div>
        )}

        {/* Loading bar keyframes */}
        <style>
          {`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(0); }
            }
          `}
        </style>
      </div>
    </MainLayout>
  );
};
