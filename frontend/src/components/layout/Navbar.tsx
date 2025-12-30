import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import axiosInstance from "../../lib/axios";

interface User {
  userId: number;
  name?: string;
  email?: string;
  roleId?: number; // 1=admin, 2=instructor, 3=student
}

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{courseId: number; title: string; price: number; rating: number}[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await axiosInstance.get(`/Courses/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response || []);
      setShowResults(true);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleCourseClick = (courseId: number) => {
    setShowResults(false);
    setSearchQuery("");
    navigate(`/course/${courseId}`);
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
          Motive
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

      <div ref={searchRef} style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search courses..."
          style={{
            width: "60%",
            maxWidth: 400,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        {showResults && searchResults.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              maxWidth: 400,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxHeight: 400,
              overflowY: "auto",
              zIndex: 2000,
            }}
          >
            {searchResults.map((course) => (
              <div
                key={course.courseId}
                onClick={() => handleCourseClick(course.courseId)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <div style={{ fontWeight: 600, color: "#333", marginBottom: 4 }}>{course.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#666" }}>
                  <span>${course.price.toFixed(2)}</span>
                  <span>⭐ {course.rating}</span>
                </div>
              </div>
            ))}
          </div>
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
