import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

const validateCardNumber = (num: string) => {
  const digits = num.replace(/\s+/g, "");
  return /^[0-9]{13,19}$/.test(digits);
};

const validateExpiry = (mmyy: string) => {
  if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(mmyy)) return false;
  const [mm, yy] = mmyy.split("/").map((s) => parseInt(s, 10));
  const now = new Date();
  const year = 2000 + yy;
  const exp = new Date(year, mm - 1, 1);
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
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    if (!cardName.trim()) return setError("Please enter the cardholder name.");
    if (!validateCardNumber(cardNumber)) return setError("Invalid card number.");
    if (!validateExpiry(expiry)) return setError("Invalid or expired expiry date (MM/YY).");
    if (!validateCvv(cvv)) return setError("Invalid CVV.");

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setProcessing(false);
    alert(`Payment successful for course ${courseId} — $${price}`);
    navigate("/my-courses");
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "24px auto", padding: 20, background: "#fff", borderRadius: 8 }}>
        <h2>Payment</h2>
        <p>Course: {courseId || "Unknown"}</p>
        <p>Amount: ${price}</p>

        {error && <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "block" }}>
            Cardholder name
            <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>

          <label style={{ display: "block" }}>
            Card number
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9\s]/g, ""))}
              placeholder="4242 4242 4242 4242"
              maxLength={23}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ flex: 1 }}>
              Expiry (MM/YY)
              <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
            <label style={{ flex: 1 }}>
              CVV
              <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))} placeholder="123" maxLength={4} style={{ width: "100%", padding: 8, marginTop: 6 }} />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <button type="submit" disabled={processing} style={{ padding: "10px 14px", background: "#0a84ff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
              {processing ? "Processing..." : `Pay $${price}`}
            </button>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: "8px 12px", borderRadius: 8 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
