import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { CourseHero } from "../features/store/CourseHero";
import { ReviewList } from "../features/store/ReviewList";
import { courseService } from "../services/courseService";
import { enrollmentService } from "../services/enrollmentService";
import { authService } from "../services/authService";

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

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
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    navigate(path);
  };

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (loading)
    return (
      <MainLayout>
        <div>Loading...</div>
      </MainLayout>
    );

  if (!course)
    return (
      <MainLayout>
        <div>Course not found</div>
      </MainLayout>
    );

  // --- Derived values ---
  const instructorName =
    course.instructor?.length > 0 ? course.instructor[0].userName : "Instructor";

  const avgRating =
    course.reviews && course.reviews.length > 0
      ? course.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / course.reviews.length
      : 0;

  const mappedReviews =
    course.reviews?.map((r: any, i: number) => ({
      id: String(i + 1),
      author: r.userName,
      rating: r.rating,
      text: r.comment,
      date: r.date?.slice(0, 10) ?? "",
    })) ?? [];

  return (
    <MainLayout>
      {/* --- Hero Section --- */}
      <CourseHero
        title={course.title}
        description={course.description}
        instructor={instructorName}
        rating={avgRating}
        price={course.price}
        onEnroll={handleEnroll}
      />

      {/* --- Buy / Enroll Buttons --- */}
      <div style={{ padding: "16px 0", display: "flex", gap: 12 }}>
        {course.price ? (
          <button
            onClick={handleBuyNow}
            style={{
              padding: "10px 14px",
              background: "#646cff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Buy now
          </button>
        ) : null}

        <button
          onClick={handleEnroll}
          disabled={isEnrolling}
          style={{
            padding: "10px 14px",
            background: "transparent",
            color: "#111",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {isEnrolling ? "Enrolling..." : "Enroll"}
        </button>
      </div>

      {/* --- Course Info --- */}
      <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 20 }}>
        <div>
          <strong>Category:</strong> {course.categories?.join(", ") ?? "N/A"}
        </div>
        <div><strong>Language:</strong> {course.language}</div>
        <div><strong>Status:</strong> {course.status}</div>
        <div><strong>Created:</strong> {new Date(course.createdAt).toLocaleDateString()}</div>
      </div>

      {/* --- Objectives --- */}
      {course.objectives?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>What you'll learn</h3>
          <ul>
            {course.objectives.map((o: string, i: number) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Requirements --- */}
      {course.requirements?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Requirements</h3>
          <ul>
            {course.requirements.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Target Audience --- */}
      {course.targetAudience?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Who this course is for</h3>
          <ul>
            {course.targetAudience.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Sections & Lessons as Dropdown --- */}
      {course.sections?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Course Content</h3>
          {course.sections.map((s: any) => (
            <div key={s.sectionId} style={{ marginBottom: 12 }}>
              <button
                onClick={() => toggleSection(s.sectionId)}
                style={{
                  background: "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  padding: "6px 12px",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  fontWeight: "bold"
                }}
              >
                {s.title} {openSections[s.sectionId] ? "▲" : "▼"}
              </button>
              {openSections[s.sectionId] && (
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {s.lessons.map((l: any) => (
                    <li key={l.lessonId}>{l.title}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* --- Reviews --- */}
      <ReviewList reviews={mappedReviews} />
    </MainLayout>
  );
};
