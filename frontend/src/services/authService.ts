import axiosInstance from "../lib/axios";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/Auth/login", { email, password });

      if (!response.data || typeof response.data.userId === "undefined") {
        throw new Error("Login failed: invalid response from server");
      }

      const { userId, role } = response.data;
      const user = { userId, role, email };

      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("authChanged"));
      return user;

    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },  // ← comma added here

  register: async (name: string, email: string, password: string, role: string = "student") => {
    const response = await axiosInstance.post("/Auth/register", { name, email, password, role });
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
