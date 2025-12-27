import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { LoginForm } from "../features/auth/LoginForm";
import { authService } from "../services/authService";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");

      // Call backend login
      const { user } = await authService.login(email, password);

      // Redirect only if login succeeds
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect") || "/my-courses";
      navigate(redirect);
    } catch (err: any) {
      // Handle backend errors
      if (err?.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(err?.response?.data?.message || err.message || "Login failed");
      }
      // Do NOT navigate
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: "400px", margin: "40px auto" }}>
        <h2>Login</h2>
        {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </MainLayout>
  );
};
