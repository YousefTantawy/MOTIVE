import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { RegisterForm } from "../features/auth/RegisterForm";
import { authService } from "../services/authService";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");

  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      setError("");

      // Map role string to roleId
      let roleId = 2; // default student
      if (role === "instructor") roleId = 1;
      else if (role === "admin") roleId = 0; // if you allow admin

      // Call authService with correct payload
      await authService.register(firstName, lastName, email, password, roleId);

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

        {/* Role selection */}
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

        {/* Register Form with separate first & last name */}
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          selectedRole={role}
          useSeparateNameFields={true} // optional flag to render two inputs
        />

        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </MainLayout>
  );
};
