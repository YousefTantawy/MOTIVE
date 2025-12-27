// Navbar.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(
    authService.getCurrentUser()
  );
  const [search, setSearch] = useState("");

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
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
        zIndex: 1000,
        width: "100%",
        height: 64,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
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
            <Link to="/profile" style={{ ...linkStyle("/profile"), whiteSpace: "nowrap" }}>
              Profile
            </Link>
            {user.role === "instructor" && (
              <Link to="/instructor" style={{ ...linkStyle("/instructor"), whiteSpace: "nowrap" }}>
                Studio
              </Link>
            )}
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: 6,
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#646cff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

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
