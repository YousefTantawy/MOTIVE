import React, { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";

export interface SimpleCourse {
  courseId: number;
  title: string;
  price: number;
  createdAt: string;
  avgRating: number;
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
    setState: React.Dispatch<React.SetStateAction<SimpleCourse[]>>
  ) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} failed`);
    const data = await res.json();
    setState(data);
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchSection("/api/Courses/trending", setTrending),
      fetchSection("/api/Courses/recent", setRecent),
      fetchSection("/api/Courses/bestsellers", setBestSellers),
      fetchSection("/api/Courses/toprated", setTopRated)
    ])
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Welcome to Motive</h1>

      {/* Trending */}
      <Section title="Trending">
        {trending.map(c => (
          <CourseCard
            key={c.courseId}
            courseId={c.courseId}
            title={c.title}
            description={`<strong>Price:</strong> $${c.price}`}
            reviews={Array(c.avgRating).fill("⭐")}
          />
        ))}
      </Section>

      {/* Recent */}
      <Section title="Recently Added">
        {recent.map(c => (
          <CourseCard
            key={c.courseId}
            courseId={c.courseId}
            title={c.title}
            description={`<strong>Price:</strong> $${c.price}`}
            reviews={Array(c.avgRating).fill("⭐")}
          />
        ))}
      </Section>

      {/* Best Sellers */}
      <Section title="Best Sellers">
        {bestSellers.map(c => (
          <CourseCard
            key={c.courseId}
            courseId={c.courseId}
            title={c.title}
            description={`<strong>Price:</strong> $${c.price}`}
            reviews={Array(c.avgRating).fill("⭐")}
          />
        ))}
      </Section>

      {/* Top Rated */}
      <Section title="Top Rated">
        {topRated.map(c => (
          <CourseCard
            key={c.courseId}
            courseId={c.courseId}
            title={c.title}
            description={`<strong>Price:</strong> $${c.price}`}
            reviews={Array(c.avgRating).fill("⭐")}
          />
        ))}
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => (
  <div style={{ marginTop: "25px" }}>
    <h2>{title}</h2>

    <div
      style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
      }}
    >
      {children}
    </div>
  </div>
);
