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
    const ratingText =
      c.avgRating !== undefined && c.avgRating !== null
        ? `${c.avgRating.toFixed(1)} / 5.0`
        : "N/A";

    return (
      <CourseCard
        key={c.courseId}
        courseId={c.courseId}
        title={c.title}
        description={`<strong>Price:</strong> $${c.price}<br/><strong>Rating:</strong> ${ratingText}`}
        reviews={
          c.avgRating !== null && c.avgRating !== undefined
            ? Array.from({ length: 5 }, (_, i) => {
                const percentage = Math.min(Math.max(c.avgRating - i, 0), 1);
                return percentage;
              })
            : []
        }
      />
    );
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Welcome to Motive</h1>

      <CarouselSection title="Trending" courses={trending} />
      <CarouselSection title="Recently Added" courses={recent} />
      <CarouselSection title="Best Sellers" courses={bestSellers} />
      <CarouselSection title="Top Rated" courses={topRated} />
    </div>
  );
};

// Carousel Section
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
      <h2>{title}</h2>
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
        }}
      >
        {courses.map((c) => (
          <div key={c.courseId} style={{ minWidth: 250, flexShrink: 0 }}>
            <CourseCard
              courseId={c.courseId}
              title={c.title}
              description={`<strong>Price:</strong> $${c.price}`}
              reviews={[]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
