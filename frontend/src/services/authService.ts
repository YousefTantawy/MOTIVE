import axiosInstance from "../lib/axios";

export interface User {
  userId: number;
  email: string;
  roleId: number; // 1=admin, 2=instructor, 3=student
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await axiosInstance.post<{ userId: number; roleId: number }>("/Auth/login", { email, password });
    const user: User = { userId: response.userId, email, roleId: response.roleId };
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("authChanged"));
    return user;
  },

  register: async (firstName: string, lastName: string, email: string, password: string, roleId: number): Promise<User> => {
    const response = await axiosInstance.post<{ userId: number; roleId: number }>("/Auth/register", { firstName, lastName, email, password, roleId });
    const user: User = { userId: response.userId, email, roleId: response.roleId };
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("authChanged"));
    return user;
  },

  logout: () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  fetchCurrentUser: async (userId: number) => {
    return await axiosInstance.get<{
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      headline: string;
      biography: string;
      profilePictureUrl: string;
      roleId: number;
    }>(`/Auth/profile/${userId}`);
  },
};
