import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(
    authService.getCurrentUser()
  );

  const linkStyle = (path: string) => ({
    marginRight: "20px",
    textDecoration: "none",
    color: location.pathname === path ? "#646cff" : "#fff",
    fontWeight: location.pathname === path ? "bold" : "normal",
  });

  useEffect(() => {
    const onAuth = () => setUser(authService.getCurrentUser());
    window.addEventListener("authChanged", onAuth);
    return () => window.removeEventListener("authChanged", onAuth);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  return (
    <nav
      role="navigation"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: "#111",
        color: "#fff",
        position: "sticky",
        top: 0,
        width: "100%",
        height: 64,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          to="/"
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "20px",
            marginRight: "40px",
            textDecoration: "none",
          }}
        >
          CoursePlatform
        </Link>
        <Link to="/" style={linkStyle("/")}>Home</Link>
        {user && (
          <>
            <Link to="/my-courses" style={linkStyle("/my-courses")}>My Learning</Link>
            {user.role === "instructor" && <Link to="/instructor" style={linkStyle("/instructor")}>Studio</Link>}
            <Link to="/profile" style={linkStyle("/profile")}>Profile</Link>
          </>
        )}
      </div>

      <div>
        {!user ? (
          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "8px 12px",
              backgroundColor: "#646cff",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              padding: "8px 12px",
            }}
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};
