import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../lib/axios";
import { CourseCard } from "../components/CourseCard";

export interface SimpleCourse {
  courseId: number;
  title: string;
  price: number;
  createdAt: string;
  avgRating: number | null;
}

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<SimpleCourse[]>([]);
  const [recent, setRecent] = useState<SimpleCourse[]>([]);
  const [bestSellers, setBestSellers] = useState<SimpleCourse[]>([]);
  const [topRated, setTopRated] = useState<SimpleCourse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchSection(
    url: string,
    setter: React.Dispatch<React.SetStateAction<SimpleCourse[]>>
  ) {
    try {
      const data = await axiosInstance.get<SimpleCourse[]>(url);
      setter(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchSection("/Courses/trending", setTrending),
      fetchSection("/Courses/recent", setRecent),
      fetchSection("/Courses/bestsellers", setBestSellers),
      fetchSection("/Courses/toprated", setTopRated),
    ]).finally(() => setLoading(false));
  }, []);

  const renderCourseCard = (c: SimpleCourse) => {
    // Build array of star fill percentages
    const reviews =
      c.avgRating !== null && c.avgRating !== undefined
        ? Array.from({ length: 5 }, (_, i) => Math.min(Math.max(c.avgRating - i, 0), 1))
        : [];

    return (
      <CourseCard
        key={c.courseId}
        courseId={c.courseId}
        title={c.title}
        description={`<strong>Price:</strong> $${c.price}`}
        reviews={reviews}
      />
    );
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 20px" }}>
      <CarouselSection title="Trending" courses={trending} />
      <CarouselSection title="Recently Added" courses={recent} />
      <CarouselSection title="Best Sellers" courses={bestSellers} />
      <CarouselSection title="Top Rated" courses={topRated} />
    </div>
  );
};

// Horizontal Carousel Section
const CarouselSection: React.FC<{ title: string; courses: SimpleCourse[] }> = ({
  title,
  courses,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    containerRef.current.scrollBy({ left: direction === "right" ? width : -width, behavior: "smooth" });
  };

  return (
    <div style={{ marginTop: 25, position: "relative" }}>
      <h2 style={{ marginLeft: 0 }}>{title}</h2>

      <button
        onClick={() => scroll("left")}
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
        }}
      >
        ◀
      </button>
      <button
        onClick={() => scroll("right")}
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
        }}
      >
        ▶
      </button>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 16,
          scrollBehavior: "smooth",
          paddingBottom: 10,
          paddingLeft: 0,
        }}
      >
        {courses.map((c) => (
          <div key={c.courseId} style={{ minWidth: 250, flexShrink: 0 }}>
            {renderCourseCard(c)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Render stars function outside component to reuse
const renderCourseCard = (c: SimpleCourse) => {
  const reviews =
    c.avgRating !== null && c.avgRating !== undefined
      ? Array.from({ length: 5 }, (_, i) => Math.min(Math.max(c.avgRating - i, 0), 1))
      : [];

  return (
    <CourseCard
      key={c.courseId}
      courseId={c.courseId}
      title={c.title}
      description={`<strong>Price:</strong> $${c.price}`}
      reviews={reviews}
    />
  );
};
