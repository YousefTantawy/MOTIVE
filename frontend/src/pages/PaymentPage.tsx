import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import axiosInstance from "../lib/axios";

const validateCardNumber = (num: string) => /^[0-9]{13,19}$/.test(num.replace(/\s+/g, ""));
const validateExpiry = (mmyy: string) => {
  if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(mmyy)) return false;
  const [mm, yy] = mmyy.split("/").map((s) => parseInt(s, 10));
  const now = new Date();
  const exp = new Date(2000 + yy, mm - 1, 1);
  exp.setMonth(exp.getMonth() + 1);
  exp.setDate(0);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
};
const validateCvv = (cvv: string) => /^[0-9]{3,4}$/.test(cvv);

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const courseId = params.get("courseId") || "";
  const priceParam = params.get("price") || "0";

  const [courseName, setCourseName] = useState<string>(`Course ${courseId}`);
  const [price, setPrice] = useState<string>(priceParam);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch course info on mount
  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/Courses/${courseId}`);
        setCourseName(res.data.title);
        setPrice(res.data.price.toString());
        console.log("Fetched course info:", res.data);
      } catch (err: any) {
        console.error("Failed to fetch course info:", err);
        setCourseName(`Course ${courseId}`);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!cardName.trim()) return setPopup({ type: "error", message: "Please enter the cardholder name." });
    if (!validateCardNumber(cardNumber)) return setPopup({ type: "error", message: "Invalid card number." });
    if (!validateExpiry(expiry)) return setPopup({ type: "error", message: "Invalid or expired expiry date (MM/YY)." });
    if (!validateCvv(cvv)) return setPopup({ type: "error", message: "Invalid CVV." });

    setProcessing(true);
    try {
      const payload = { userId: 1, courseId: parseInt(courseId), paymentMethod: "card" };
      console.log("Sending payment payload:", payload);

      const response = await axiosInstance.post("/Payments/checkout", payload, { responseType: "text" });

      console.log("Payment response:", response.data);

      if (response.data === "success") {
        setPopup({ type: "success", message: `Payment completed for "${courseName}"` });
        setTimeout(() => navigate("/my-courses"), 2000);
      } else if (response.data.includes("already enrolled")) {
        setPopup({ type: "error", message: "User is already enrolled in this course." });
      } else {
        setPopup({ type: "error", message: "Payment failed. Please try again." });
      }
    } catch (err: any) {
      console.error("Payment request error:", err);
      setPopup({ type: "error", message: "Payment failed: " + (err.response?.status || err.message) });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "24px auto", padding: 20, background: "#f9f9f9", borderRadius: 10, position: "relative" }}>
        <h2 style={{ marginBottom: 16 }}>Complete Your Payment</h2>
        <p>Course: <strong>{courseName}</strong></p>
        <p>Amount: <strong>${price}</strong></p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <label>
            Cardholder Name
            <input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Name on card"
              maxLength={255}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <label>
            Card Number
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9\s]/g, ""))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <div style={{ display: "flex", gap: 16 }}>
            <label style={{ flex: 1 }}>
              Expiry (MM/YY)
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ flex: 1 }}>
              CVV
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="123"
                maxLength={4}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="submit"
              disabled={processing}
              style={{ flex: 1, padding: 12, backgroundColor: "#0a84ff", color: "#fff", borderRadius: 8, fontWeight: 600 }}
            >
              {processing ? "Processing..." : `Pay $${price}`}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            >
              Cancel
            </button>
          </div>
        </form>

        {popup && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: popup.type === "success" ? "#4caf50" : "#f44336",
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
              zIndex: 1000
            }}
          >
            {popup.type === "success" && <span style={{ fontSize: 48 }}>✔️</span>}
            <span>{popup.message}</span>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
