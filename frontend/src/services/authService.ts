// src/services/authService.ts
import axiosInstance from "../lib/axios";

export interface User {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roleId: number; // 1=admin, 2=instructor, 3=student
  headline?: string;
  biography?: string;
  profilePictureUrl?: string | null;
}

export const authService = {
  // --- LOGIN ---
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await axiosInstance.post<{
        message: string;
        userId: number;
        roleId: number;
      }>("/Auth/login", { email, password });

      if (!response || typeof response.userId === "undefined") {
        throw new Error("Login failed: invalid response from server");
      }

      const { userId, roleId } = response;
      const user: User = { userId, email, roleId };

      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("authChanged"));

      return user;
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    }
  },

  // --- LOGOUT ---
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
  },

  // --- GET CURRENT USER FROM LOCAL STORAGE ---
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // --- FETCH FULL USER DATA FROM SERVER ---
  fetchCurrentUser: async (userId: number) => {
    try {
      return await axiosInstance.get<{
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        roleId: number;
        headline: string;
        biography: string;
        profilePictureUrl: string | null;
        createdAt: string;
      }>(`/Auth/profile/${userId}`);
    } catch (err) {
      console.error("Failed to fetch full user info:", err);
      throw err;
    }
  },
};
