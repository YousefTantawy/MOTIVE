import axiosInstance from "../lib/axios";

export interface User {
  userId: number;
  email: string;
  roleId: number; // 1=admin, 2=instructor, 3=student
}

export const authService = {
  // --- LOGIN ---
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Call backend
      const response = await axiosInstance.post<{ message: string; userId: number; roleId: number }>(
        "/Auth/login",
        { email, password }
      );

      if (!response || typeof response.userId === "undefined") {
        throw new Error("Login failed: invalid response from server");
      }

      const { userId, roleId } = response;
      const user: User = { userId, email, roleId };

      // Store locally for auth persistence
      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("authChanged"));

      return user;
    } catch (error: any) {
      let message = error.message || "Unknown error";
      if (message.includes("status: 401")) message = "Unauthorized access";
      else if (message.includes("status: 403")) message = "Forbidden access";
      else if (message.includes("status: 404")) message = "Resource not found";
      else if (message.includes("status: 500")) message = "Server error, please try again later";

      console.error("Login error:", message);
      throw new Error(message);
    }
  },

  // --- REGISTER ---
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roleId: number
  ): Promise<User> => {
    try {
      const response = await axiosInstance.post<{ message: string; userId: number; roleId: number }>(
        "/Auth/register",
        { firstName, lastName, email, password, roleId }
      );

      if (!response || typeof response.userId === "undefined") {
        throw new Error("Register failed: invalid response from server");
      }

      const { userId, roleId: returnedRoleId } = response;
      const user: User = { userId, email, roleId: returnedRoleId };

      localStorage.setItem("authToken", "mock_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("authChanged"));

      return user;
    } catch (error: any) {
      let message = error.message || "Unknown error";
      if (message.includes("status: 400")) message = "Bad request, check your input";
      else if (message.includes("status: 409")) message = "Email already exists";
      else if (message.includes("status: 500")) message = "Server error, please try again later";

      console.error("Register error:", message);
      throw new Error(message);
    }
  },

  // --- LOGOUT ---
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
  },

  // --- GET CURRENT USER ---
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
},

fetchCurrentUser: async (userId: number) => {
    try {
      // This should match your backend endpoint returning full user info
      const user = await axiosInstance.get<{
        userId: number;
        email: string;
        firstName: string;
        lastName: string;
        headline: string;
        biography: string;
        profilePictureUrl: string;
        roleId: number;
      }>(`/Auth/get-user/${userId}`);

      return user;
    } catch (err) {
      console.error("Failed to fetch full user info:", err);
      throw err;
    }
  },
};
;
