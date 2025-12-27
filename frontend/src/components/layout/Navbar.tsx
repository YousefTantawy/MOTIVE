import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(
    authService.getCurrentUser()
  );
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav
      role="navigation"
      data-test-id="main-navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        boxSizing: "border-box",
        backgroundColor: "#111",
        color: "#fff",
        position: "sticky",
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1000,
        width: "100%",
        height: 64,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden", minWidth: 0 }}>
        <Link
          to="/"
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "20px",
            marginRight: "40px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          CoursePlatform
        </Link>
        <Link to="/" style={{ ...linkStyle("/"), whiteSpace: "nowrap" }}>
          Home
        </Link>
        {user && (
          <>
            <Link to="/my-courses" style={{ ...linkStyle("/my-courses"), whiteSpace: "nowrap" }}>
              My Learning
            </Link>
            {user.role === "instructor" && (
              <Link to="/instructor" style={{ ...linkStyle("/instructor"), whiteSpace: "nowrap" }}>
                Studio
              </Link>
            )}
          </>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", maxWidth: 300, margin: "0 12px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search courses..."
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "6px 12px",
            marginLeft: 6,
            background: "#646cff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* Right Login/Logout */}
      <div style={{ flex: "0 0 auto", marginLeft: 12 }}>
        {!user ? (
          <Link
            to="/login"
            aria-label="Login"
            style={{
              display: "inline-block",
              padding: "8px 12px",
              backgroundColor: "#646cff",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: "600",
              boxShadow: "0 2px 6px rgba(100,108,255,0.25)",
              border: "1px solid rgba(0,0,0,0.08)",
              whiteSpace: "nowrap",
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
