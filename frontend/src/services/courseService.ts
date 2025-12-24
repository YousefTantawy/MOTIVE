import axiosInstance from "../lib/axios";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  instructor: string;
  thumbnail?: string;
  createdAt: string;
}

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const response = await axiosInstance.get("/courses");
    return response.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    const response = await axiosInstance.post("/courses", courseData);
    return response.data;
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    const response = await axiosInstance.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/courses/${id}`);
  },
};
