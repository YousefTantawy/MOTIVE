import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import axiosInstance from "../lib/axios"; // make sure this exists

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
  const price = params.get("price") || "0";

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!cardName.trim()) return setPopup({ type: "error", message: "Please enter the cardholder name." });
    if (!validateCardNumber(cardNumber)) return setPopup({ type: "error", message: "Invalid card number." });
    if (!validateExpiry(expiry)) return setPopup({ type: "error", message: "Invalid or expired expiry date (MM/YY)." });
    if (!validateCvv(cvv)) return setPopup({ type: "error", message: "Invalid CVV." });

    setProcessing(true);
    try {
      const response = await axiosInstance.post(
        "/Payments/checkout", // ensure your baseURL is correct
        { userId: 1, courseId: parseInt(courseId), paymentMethod: "card" },
        { responseType: "text" } // treat plain text response
      );

      if (response.data === "success") {
        setPopup({ type: "success", message: `Payment completed for course ${courseId}` });
        setTimeout(() => navigate("/my-courses"), 2000); // auto-navigate after 2s
      } else {
        setPopup({ type: "error", message: "Payment failed. Please try again." });
      }
    } catch (err: any) {
      setPopup({ type: "error", message: "Payment failed: " + (err.response?.status || err.message) });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "24px auto", padding: 20, background: "#fff", borderRadius: 8, position: "relative" }}>
        <h2>Payment</h2>
        <p>Course: {courseId || "Unknown"}</p>
        <p>Amount: ${price}</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            Cardholder name
            <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" maxLength={255} />
          </label>

          <label>
            Card number
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9\s]/g, ""))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ flex: 1 }}>
              Expiry (MM/YY)
              <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
            </label>
            <label style={{ flex: 1 }}>
              CVV
              <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))} placeholder="123" maxLength={4} />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" disabled={processing}>
              {processing ? "Processing..." : `Pay $${price}`}
            </button>
            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>

        {/* Popup overlay */}
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
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            {popup.type === "success" && (
              <span style={{ fontSize: 48 }}>✔️</span>
            )}
            <span>{popup.message}</span>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
