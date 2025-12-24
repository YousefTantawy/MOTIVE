import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { CourseHero } from "../features/store/CourseHero";
import { ReviewList } from "../features/store/ReviewList";
import { courseService } from "../services/courseService";
import { enrollmentService } from "../services/enrollmentService";
import { useSearchParams } from "react-router-dom";

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (id) {
          const data = await courseService.getCourseById(id);
          setCourse(data);
        }
      } catch (error) {
        console.error("Failed to load course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      if (id) {
        await enrollmentService.enrollCourse(id);
        navigate("/my-courses");
      }
    } catch (error) {
      console.error("Failed to enroll:", error);
      alert("Failed to enroll in course");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleBuyNow = () => {
    const user = authService.getCurrentUser();
    const params = new URLSearchParams();
    if (id) params.set("courseId", id);
    if (course && course.price) params.set("price", String(course.price));
    const path = `/payment?${params.toString()}`;
    if (!user) {
      // redirect to login and include intended destination
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    navigate(path);
  };

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!course) return <MainLayout><div>Course not found</div></MainLayout>;

  const mockReviews = [
    {
      id: "1",
      author: "John Doe",
      rating: 5,
      text: "Amazing course! Highly recommended.",
      date: "2025-12-20",
    },
    {
      id: "2",
      author: "Jane Smith",
      rating: 4,
      text: "Great content, could use more examples.",
      date: "2025-12-15",
    },
  ];

  return (
    <MainLayout>
      <CourseHero
        title={course.title}
        description={course.description}
        instructor={course.instructor}
        rating={course.rating}
        price={course.price}
        onEnroll={handleEnroll}
      />

      <div style={{ padding: "16px 0", display: "flex", gap: 12 }}>
        {course.price ? (
          <button
            onClick={handleBuyNow}
            style={{ padding: "10px 14px", background: "#646cff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Buy now
          </button>
        ) : null}

        <button
          onClick={handleEnroll}
          disabled={isEnrolling}
          style={{ padding: "10px 14px", background: "transparent", color: "#111", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer" }}
        >
          {isEnrolling ? "Enrolling..." : "Enroll"
          }
        </button>
      </div>

      <ReviewList reviews={mockReviews} />
    </MainLayout>
  );
};
