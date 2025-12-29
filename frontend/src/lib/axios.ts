// src/lib/axios.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://motive.italynorth.cloudapp.azure.com/api";

export const axiosInstance = {
  async request<T>(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET", body?: any): Promise<T> {
  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Read text first
    const text = await response.text();

    // If response not ok → throw error
    if (!response.ok) {
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }

    // If empty body → return null
    if (!text) return null as unknown as T;

    // Try parsing JSON, fallback to text
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
},


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
