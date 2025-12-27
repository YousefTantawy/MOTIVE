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
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch live profile on mount and on auth change
  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = authService.getCurrentUser();


      if (currentUser) {
        try {
          const profile = await authService.fetchProfile(currentUser.userId);
          setUser({
            ...currentUser,
            roleId: Number(profile.roleId), // Ensure number
                  console.log("CurrentUser:", currentUser);
                  console.log("Profile fetched:", profile);
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setUser(currentUser); // fallback to localStorage user
        }
      } else {
        setUser(null);
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

  // Debug log to verify roleId
  console.log("Navbar user:", user);

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
        <Link to="/" style={{ color: "#fff", fontWeight: "bold", fontSize: 20, textDecoration: "none" }}>
          CoursePlatform
        </Link>

        <Link to="/" style={linkStyle("/")}>Home</Link>

        {user && (
          <>
            <Link to="/my-courses" style={linkStyle("/my-courses")}>My Learning</Link>

            {/* Instructor Studio only for roleId 2 */}
            {user.roleId === 2 && <Link to="/instructor" style={linkStyle("/instructor")}>Studio</Link>}

            {/* Admin Dashboard only for roleId 1 */}
            {user.roleId === 1 && <Link to="/admin" style={linkStyle("/admin")}>Admin Dashboard</Link>}

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
      <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
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
