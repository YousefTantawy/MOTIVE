import axiosInstance from "../lib/axios";

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
}

export const enrollmentService = {
  enrollCourse: async (courseId: string): Promise<Enrollment> => {
    const response = await axiosInstance.post("/enrollments", { courseId });
    return response.data;
  },

  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await axiosInstance.get("/enrollments/me");
    return response.data;
  },

  getEnrollmentById: async (id: string): Promise<Enrollment> => {
    const response = await axiosInstance.get(`/enrollments/${id}`);
    return response.data;
  },

  updateProgress: async (enrollmentId: string, progress: number, completedLessonId?: string): Promise<Enrollment> => {
    const response = await axiosInstance.patch(`/enrollments/${enrollmentId}`, {
      progress,
      completedLessonId,
    });
    return response.data;
  },

  completeEnrollment: async (enrollmentId: string): Promise<Enrollment> => {
    const response = await axiosInstance.patch(`/enrollments/${enrollmentId}/complete`);
    return response.data;
  },
};
