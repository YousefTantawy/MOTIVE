import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { RegisterForm } from "../features/auth/RegisterForm";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");
      // For mock demo, just store user data
      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify({ name, email, role }));
      navigate("/my-courses");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: "400px", margin: "40px auto" }}>
        <h2>Register</h2>
        {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setRole("student")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: role === "student" ? "2px solid #646cff" : "1px solid #ccc",
              background: role === "student" ? "#f0f0ff" : "#fff",
              cursor: "pointer",
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("instructor")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: role === "instructor" ? "2px solid #646cff" : "1px solid #ccc",
              background: role === "instructor" ? "#f0f0ff" : "#fff",
              cursor: "pointer",
            }}
          >
            Instructor
          </button>
        </div>

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} selectedRole={role} />
        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </MainLayout>
  );
};

