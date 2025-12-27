import axiosInstance from "../lib/axios";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post<{ message: string; userId: number; role: string }>(
        "/Auth/login",
        { email, password }
      );

      if (!response || typeof response.userId === "undefined") {
        throw new Error("Login failed: invalid response from server");
      }

      const { userId, role } = response;
      const user = { userId, role, email };

      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("authChanged"));
      return user;

    } catch (error: any) {
      const message = error.message || "Unknown error";
      console.error("Login error:", message);
      throw new Error(message);
    }
  },

  register: async (name: string, email: string, password: string, role: string = "student") => {
    try {
      const response = await axiosInstance.post<{ message: string; userId: number; role: string }>(
        "/Auth/register",
        { name, email, password, role }
      );

      if (!response || typeof response.userId === "undefined") {
        throw new Error("Register failed: invalid response from server");
      }

      const { userId, role: returnedRole } = response;
      const user = { userId, role: returnedRole || role, email };

      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("authChanged"));
      return user;

    } catch (error: any) {
      const message = error.message || "Unknown error";
      console.error("Register error:", message);
      throw new Error(message);
    }
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
