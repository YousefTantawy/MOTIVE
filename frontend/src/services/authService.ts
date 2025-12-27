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
      // Map HTTP status codes to custom messages
      let message = error.message || "Unknown error";
      if (message.includes("status: 401")) message = "Unauthorized access";
      else if (message.includes("status: 403")) message = "Forbidden access";
      else if (message.includes("status: 404")) message = "Resource not found";
      else if (message.includes("status: 409")) message = "Conflict: resource already exists";
      else if (message.includes("status: 500")) message = "Server error, please try again later";

      console.error("Login error:", message);
      throw new Error(message);
    }
  },

register: async (firstName: string, lastName: string, email: string, password: string, roleId: number) => {
  try {
    const response = await axiosInstance.post<{ message: string; userId: number; role: string }>(
      "/Auth/register",
      { firstName, lastName, email, password, roleId }
    );

    if (!response || typeof response.userId === "undefined") {
      throw new Error("Register failed: invalid response from server");
    }

    const { userId, role } = response;
    const user = { userId, role, email };

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
};

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
