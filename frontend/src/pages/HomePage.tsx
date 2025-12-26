import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { CourseCard } from "../components/CourseCard";

interface Course {
  courseId: number;
  title: string;
  description: string;
  reviews?: string[];
}

interface HomeData {
  trending: Course[];
  topRated: Course[];
  newest: Course[];
  bestSellers: Course[];
}

export const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<HomeData>({
    trending: [],
    topRated: [],
    newest: [],
    bestSellers: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosInstance.get("/Courses/home");

        // ⚠️ IMPORTANT — match backend casing:
        setCourses({
          trending: res.data.Trending ?? [],
          topRated: res.data.TopRated ?? [],
          newest: res.data.Newest ?? [],
          bestSellers: res.data.BestSellers ?? []
        });
      } catch (e) {
        console.error(e);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (error) return <p style={{ padding: 40 }}>{error}</p>;

  return (
    <main style={{ padding: 40, display: "flex", flexDirection: "column", gap: 40 }}>

      <Section title="Most Trending" list={courses.trending} />

      <Section title="Top Rated" list={courses.topRated} />

      <Section title="Newest" list={courses.newest} />

      <Section title="Best Sellers" list={courses.bestSellers} />
    </main>
  );
};

const Section: React.FC<{ title: string; list: Course[] }> = ({ title, list }) => (
  <section>
    <h2 style={{ marginBottom: 16 }}>{title}</h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16
      }}
    >
      {list.map(c => (
        <CourseCard key={c.courseId} {...c} />
      ))}
    </div>
  </section>
);
