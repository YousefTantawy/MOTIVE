import axiosInstance from "../lib/axios";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/api/Auth/login", { email, password });
    const { userId, role } = response.data;

    // Save user info locally
    const user = { userId, role, email };
    localStorage.setItem("authToken", "mock_token_" + Date.now()); // Replace with real token if available
    localStorage.setItem("user", JSON.stringify(user));

    // Trigger authChanged event for navbar updates
    window.dispatchEvent(new Event("authChanged"));
    return user;
  },

  register: async (name: string, email: string, password: string, role: string = "student") => {
    const response = await axiosInstance.post("/api/Auth/register", { name, email, password, role });
    const { userId } = response.data;

    const user = { userId, role, email };
    localStorage.setItem("authToken", "mock_token_" + Date.now());
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("authChanged"));
    return user;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
