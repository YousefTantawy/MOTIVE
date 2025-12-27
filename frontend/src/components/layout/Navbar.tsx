import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

interface User {
  userId: number;
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
    let isMounted = true; // to prevent state update after unmount

    const fetchUser = async () => {
      setLoading(true);

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const profile = await authService.fetchProfile(currentUser.userId);

        if (!profile) {
          if (isMounted) {
            setUser({
              userId: currentUser.userId,
              email: currentUser.email,
              roleId: currentUser.roleId ?? 3,
            });
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setUser({
            userId: profile.userId,
            email: profile.email,
            roleId: profile.roleId ?? 3,
            name: profile.firstName ? `${profile.firstName} ${profile.lastName}` : undefined,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (isMounted) {
          setUser({
            userId: currentUser.userId,
            email: currentUser.email,
            roleId: currentUser.roleId ?? 3,
          });
          setLoading(false);
        }
      }
    };

    fetchUser();

    const onAuthChange = () => fetchUser();
    window.addEventListener("authChanged", onAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener("authChanged", onAuthChange);
    };
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
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          to="/"
          style={{ color: "#fff", fontWeight: "bold", fontSize: 20, textDecoration: "none" }}
        >
          CoursePlatform
        </Link>

        <Link to="/" style={linkStyle("/")}>Home</Link>

        {user && (
          <>
            <Link to="/my-courses" style={linkStyle("/my-courses")}>My Learning</Link>

            {user.roleId === 2 && <Link to="/instructor" style={linkStyle("/instructor")}>Studio</Link>}
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
