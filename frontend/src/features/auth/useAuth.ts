import { useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { id: string; name: string; email: string; role: "student" | "instructor" } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("authToken");
    return !!token;
  });

  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: "user_123",
        name: "John Doe",
        email,
        role: "student" as const,
      };

      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, user, login, logout };
};

export default useAuth;
