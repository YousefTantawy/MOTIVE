import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { CourseCard } from "../components/CourseCard";

interface Course {
  courseId: number;
  title: string;
  description: string;
  reviews?: any[];
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
        // IMPORTANT — your backend HomePage data is here:
        // GET /api/Courses
        const res = await axiosInstance.get("/Courses");

        setCourses({
          trending: res.data.Trending ?? [],
          topRated: res.data.TopRated ?? [],
          newest: res.data.Newest ?? [],
          bestSellers: res.data.BestSellers ?? []
        });
      } catch (err: any) {
        console.error(err);
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
    <main
      style={{
        padding: 40,
        display: "flex",
        flexDirection: "column",
        gap: 40
      }}
    >
      <Section title="Trending" list={courses.trending} />
      <Section title="Top Rated" list={courses.topRated} />
      <Section title="Newest" list={courses.newest} />
      <Section title="Best Sellers" list={courses.bestSellers} />
    </main>
  );
};

const Section: React.FC<{ title: string; list: Course[] }> = ({
  title,
  list
}) => (
  <section>
    <h2 style={{ marginBottom: 16 }}>{title}</h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 16,
        alignItems: "stretch"
      }}
    >
      {list?.map((c) => (
        <CourseCard
          key={c.courseId}
          courseId={c.courseId}
          title={c.title}
          description={c.description}
          reviews={c.reviews}
        />
      ))}
    </div>
  </section>
);
