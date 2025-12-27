import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");

      // Call backend login
      const user = await authService.login(email, password);

      // Extract roleId from backend response
      const roleId = (user as any).roleId ?? 2; // default to student if missing
      localStorage.setItem("roleId", String(roleId));

      // Default redirect
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
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <button
          onClick={() => handleLogin(email, password)}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#646cff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: 16, textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </MainLayout>
  );
};
