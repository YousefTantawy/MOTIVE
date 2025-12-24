const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export const axiosInstance = {
  async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const { method = "GET", headers = {}, body } = config;

    const token = localStorage.getItem("authToken");
    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${API_BASE_URL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  },

  get<T>(url: string) {
    return this.request<T>(url, { method: "GET" });
  },

  post<T>(url: string, data?: any) {
    return this.request<T>(url, { method: "POST", body: data });
  },

  put<T>(url: string, data?: any) {
    return this.request<T>(url, { method: "PUT", body: data });
  },

  patch<T>(url: string, data?: any) {
    return this.request<T>(url, { method: "PATCH", body: data });
  },

  delete<T>(url: string) {
    return this.request<T>(url, { method: "DELETE" });
  },
};

export default axiosInstance;
