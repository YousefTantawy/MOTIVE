import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { LoginForm } from "../features/auth/LoginForm";
import { authService } from "../services/authService";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");
      // Support two demo accounts:
      // - Admin1 / password => instructor
      // - Admin2 / password => student
      // Demo test accounts
      if (email === "student@gmail.com" && password === "student") {
        const user = { name: "Student", email, role: "student" };
        localStorage.setItem("authToken", "mock_token_" + Date.now());
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("authChanged"));
        const params = new URLSearchParams(location.search);
        const redirect = params.get("redirect") || "/my-courses";
        navigate(redirect);
        return;
      }

      if (email === "teacher@gmail.com" && password === "teacher") {
        const user = { name: "Teacher", email, role: "instructor" };
        localStorage.setItem("authToken", "mock_token_" + Date.now());
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("authChanged"));
        const params = new URLSearchParams(location.search);
        const redirect = params.get("redirect") || "/my-courses";
        navigate(redirect);
        return;
      }

      // Default mock login: accept any credentials as student
      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify({ email, role: "student" }));
      window.dispatchEvent(new Event("authChanged"));
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect") || "/my-courses";
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || "Login failed");
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

