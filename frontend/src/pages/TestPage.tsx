import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { MainLayout } from "../layouts/MainLayout";

export const TestPage: React.FC = () => {
  const navigate = useNavigate();

  const goToPayment = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      // send to login, include redirect back to payment
      navigate(`/login?redirect=/payment?courseId=test-course&price=9`);
      return;
    }
    navigate(`/payment?courseId=test-course&price=9`);
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
        <h1>Test Page</h1>
        <p>This is a simple test page to verify routing and payment flow.</p>
        <p>Click the button below to go to the payment page with dummy data.</p>
        <button onClick={goToPayment} style={{ padding: "10px 14px", background: "#646cff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Go to Payment
        </button>
      </div>
    </MainLayout>
  );
};
