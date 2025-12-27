import React, { useEffect, useState } from "react";

type Course = {
  courseId: number;
  title: string;
  price: number;
  createdAt: string;
  avgRating: number;
};

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Course[]>([]);
  const [recent, setRecent] = useState<Course[]>([]);
  const [bestSellers, setBestSellers] = useState<Course[]>([]);
  const [topRated, setTopRated] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "https://your-backend-domain.com/api/Courses";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendRes, recentRes, bestRes, topRes] = await Promise.all([
          fetch(`${API_BASE}/trending`),
          fetch(`${API_BASE}/recent`),
          fetch(`${API_BASE}/bestsellers`),
          fetch(`${API_BASE}/toprated`)
        ]);

        if (!trendRes.ok || !recentRes.ok || !bestRes.ok || !topRes.ok) {
          throw new Error("One or more API calls failed");
        }

        const trendingData = await trendRes.json();
        const recentData = await recentRes.json();
        const bestSellerData = await bestRes.json();
        const topRatedData = await topRes.json();

        setTrending(trendingData);
        setRecent(recentData);
        setBestSellers(bestSellerData);
        setTopRated(topRatedData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading home page...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const renderCourses = (list: Course[]) =>
    list.map(c => (
      <li key={c.courseId}>
        <strong>{c.title}</strong> — ${c.price} — ⭐ {c.avgRating}
      </li>
    ));

  return (
    <div>
      <h1>Home Page</h1>

      <h2>🔥 Trending</h2>
      <ul>{renderCourses(trending)}</ul>

      <h2>⭐ Top Rated</h2>
      <ul>{renderCourses(topRated)}</ul>

      <h2>🆕 Recently Added</h2>
      <ul>{renderCourses(recent)}</ul>

      <h2>🏆 Best Sellers</h2>
      <ul>{renderCourses(bestSellers)}</ul>
    </div>
  );
};

export default HomePage;
