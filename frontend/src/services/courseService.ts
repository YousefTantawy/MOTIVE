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
    return await axiosInstance.get<Course[]>("/Courses");
  },

  getCourseById: async (id: string): Promise<Course> => {
    return await axiosInstance.get<Course>(`/Courses/${id}`);
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    return await axiosInstance.post<Course>("/Courses", courseData);
  },

  updateCourse: async (
    id: string,
    courseData: Partial<Course>
  ): Promise<Course> => {
    return await axiosInstance.put<Course>(`/Courses/${id}`, courseData);
  },

  deleteCourse: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/Courses/${id}`);
  },
};
