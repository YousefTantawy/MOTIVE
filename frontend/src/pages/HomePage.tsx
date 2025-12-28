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

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 50 }}>Welcome at Motive</h1>

      <div style={{ marginBottom: 100 }}>
        <CarouselSection title="Trending" courses={trending} />
      </div>
      <div style={{ marginBottom: 100 }}>
        <CarouselSection title="Recently Added" courses={recent} />
      </div>
      <div style={{ marginBottom: 100 }}>
        <CarouselSection title="Best Sellers" courses={bestSellers} />
      </div>
      <div style={{ marginBottom: 100 }}>
        <CarouselSection title="Top Rated" courses={topRated} />
      </div>
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
    const cardWidth = 300; // fixed card width
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * 4; // move by 4 cards
    containerRef.current.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  };

  return (
    <div style={{ marginTop: 25, position: "relative" }}>
      <h2 style={{ marginLeft: 0, marginBottom: 20 }}>{title}</h2>

      <div
        style={{
          position: "relative",
        }}
        className="carousel-wrapper"
      >
        <button
          onClick={() => scroll("left")}
          className="carousel-arrow left"
          style={arrowStyle}
        >
          ◀
        </button>
        <button
          onClick={() => scroll("right")}
          className="carousel-arrow right"
          style={arrowStyle}
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
          className="carousel-container"
        >
          {courses.map((c) => (
            <div key={c.courseId} style={{ minWidth: 300, flexShrink: 0 }}>
              {renderCourseCard(c)}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .carousel-wrapper:hover .carousel-arrow {
          opacity: 1;
        }
        .carousel-arrow {
          transition: opacity 0.3s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

// Arrow button style
const arrowStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "50%",
  width: 40,
  height: 40,
  cursor: "pointer",
};

// Render CourseCard with stars
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
