import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

interface User {
  name?: string;
  email?: string;
  roleId?: number; // 1=admin, 2=instructor, 3=student
}

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

 useEffect(() => {
  const fetchUserProfile = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.fetchProfile(currentUser.userId);
      
      if (!profile) {
        console.log("Profile is null or undefined");
        setUser(currentUser); // fallback
        return;
      }

      console.log("Profile fetched:", profile); // now this will correctly log the object

      setUser({
        ...currentUser,
        roleId: profile.roleId ?? 3, // fallback to student
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setUser({
        ...currentUser,
        roleId: currentUser.roleId ?? 3,
      });
    } finally {
      setLoading(false);
    }
  };

  fetchUserProfile();
  const onAuthChange = () => fetchUserProfile();
  window.addEventListener("authChanged", onAuthChange);
  return () => window.removeEventListener("authChanged", onAuthChange);
}, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const linkStyle = (path: string) => ({
    marginRight: 20,
    textDecoration: "none",
    color: location.pathname === path ? "#646cff" : "#fff",
    fontWeight: location.pathname === path ? "bold" : "normal",
    whiteSpace: "nowrap" as const,
  });

  // Delay rendering until user is loaded
  if (loading) {
    return (
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          backgroundColor: "#111",
          color: "#fff",
        }}
      >
        Loading...
      </nav>
    );
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "#111",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: 64,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* LEFT: Logo + links */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          to="/"
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            textDecoration: "none",
          }}
        >
          CoursePlatform
        </Link>

        <Link to="/" style={linkStyle("/")}>
          Home
        </Link>

        {user && (
          <>
            <Link to="/my-courses" style={linkStyle("/my-courses")}>
              My Learning
            </Link>

            {user.roleId === 2 && (
              <Link to="/instructor" style={linkStyle("/instructor")}>
                Studio
              </Link>
            )}

            {user.roleId === 1 && (
              <Link to="/admin" style={linkStyle("/admin")}>
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/profile"
              style={{
                ...linkStyle("/profile"),
                padding: "6px 10px",
                border: "1px solid #646cff",
                borderRadius: 6,
              }}
            >
              Profile
            </Link>
          </>
        )}
      </div>

      {/* MIDDLE: Search bar */}
      <form
        onSubmit={handleSearch}
        style={{ flex: 1, display: "flex", justifyContent: "center" }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses..."
          style={{
            width: "60%",
            maxWidth: 400,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </form>

      {/* RIGHT: Login/Logout */}
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
              fontWeight: 600,
              boxShadow: "0 2px 6px rgba(100,108,255,0.25)",
              textDecoration: "none",
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
