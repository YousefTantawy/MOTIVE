import React, { useEffect, useState } from "react";
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
                return percentage; // store fraction of star
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

      <Section title="Trending">{trending.map(renderCourseCard)}</Section>
      <Section title="Recently Added">{recent.map(renderCourseCard)}</Section>
      <Section title="Best Sellers">{bestSellers.map(renderCourseCard)}</Section>
      <Section title="Top Rated">{topRated.map(renderCourseCard)}</Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div style={{ marginTop: 25 }}>
    <h2>{title}</h2>
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      }}
    >
      {children}
    </div>
  </div>
);