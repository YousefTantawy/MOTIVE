import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError("");

      let roleId = 3; // default student
      if (role === "instructor") roleId = 2;
      else if (role === "admin") roleId = 1; // optional

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
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

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
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

            <button
      onClick={handleRegister}  // ← use the correct function name
      disabled={isLoading}
      style={{
        width: "100%",
        padding: "10px 12px",
        background: "#646cff",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        boxSizing: "border-box",
      }}
    >
      {isLoading ? "Registering..." : "Register"}
    </button>

        <p style={{ marginTop: 16, textAlign: "center" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </MainLayout>
  );
};
