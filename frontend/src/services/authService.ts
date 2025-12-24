import axiosInstance from "../lib/axios";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  },

  register: async (name: string, email: string, password: string, role: "student" | "instructor" = "student") => {
    const response = await axiosInstance.post("/auth/register", { name, email, password, role });
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
