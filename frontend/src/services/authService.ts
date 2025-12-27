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
            const response = await axiosInstance.post<{ message: string; userId: number; roleId: number }>(
                "/Auth/login",
                { email, password }
            );

            if (!response || typeof response.userId === "undefined") {
                throw new Error("Login failed: invalid response from server");
            }

            const { userId, roleId } = response;
            const user: User = { userId, email, roleId };

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

    // --- NEW FUNCTION: FETCH PROFILE ---
    fetchProfile: async (userId: number) => {
        try {
            const response = await axiosInstance.get(`/Auth/profile/${userId}`);
            return response.data; // return full profile object
        } catch (error: any) {
            console.error("Fetch profile failed:", error);
            throw new Error("Failed to fetch user profile");
        }
    },
},
// --- NEW FUNCTION: GET USER WITH ROLE ---
getUserWithRole: async (): Promise<User | null> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return null;

    try {
        const profile = await authService.fetchProfile(currentUser.userId);
        return {
            userId: currentUser.userId,
            email: currentUser.email,
            roleId: profile?.roleId ?? 3, // fallback to student
        };
    } catch (err) {
        console.error("Failed to fetch profile for role:", err);
        return currentUser; // fallback if profile fetch fails
    }
}
;
