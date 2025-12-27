// services/authService.ts
import axiosInstance from "../lib/axios";

export const authService = {
  // Login user
  login: async (email: string, password: string) => {
    // API endpoint
    const response = await axiosInstance.post("/api/Auth/login", { email, password });
    const { token, user } = response;

    // Save token and user locally
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Trigger Navbar update
    window.dispatchEvent(new Event("authChanged"));

    return { token, user };
  },

  // Register user
  register: async (
    name: string,
    email: string,
    password: string,
    role: "student" | "instructor" = "student"
  ) => {
    // API endpoint
    const response = await axiosInstance.post("/api/Auth/register", { name, email, password, role });
    const { token, user } = response;

    // Save token and user locally
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Trigger Navbar update
    window.dispatchEvent(new Event("authChanged"));

    return { token, user };
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Trigger Navbar update
    window.dispatchEvent(new Event("authChanged"));
  },

  // Get current logged-in user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
