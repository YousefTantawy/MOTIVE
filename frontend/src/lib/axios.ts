// src/lib/axios.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://172.213.228.233:5168/api";

export const axiosInstance = {
  // Generic request function
  async request<T>(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET", body?: any): Promise<T> {
    const fullUrl = `${API_BASE_URL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  },

  // Convenience methods
  get<T>(url: string) {
    return this.request<T>(url, "GET");
  },

  post<T>(url: string, data?: any) {
    return this.request<T>(url, "POST", data);
  },

  put<T>(url: string, data?: any) {
    return this.request<T>(url, "PUT", data);
  },

  patch<T>(url: string, data?: any) {
    return this.request<T>(url, "PATCH", data);
  },

  delete<T>(url: string) {
    return this.request<T>(url, "DELETE");
  },
};

export default axiosInstance;
