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
  const [recommendations, setRecommendations] = useState<SimpleCourse[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const [topRated, setTopRated] = useState<SimpleCourse[]>([]);
  const [recent, setRecent] = useState<SimpleCourse[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  // ---------- HELPERS ----------
  const normalizeCourse = (c: any): SimpleCourse => {
    return {
      courseId: Number(c?.Id ?? c?.CourseId ?? c?.courseId ?? c?.id ?? 0),
      title: c?.Title ?? c?.title ?? "Untitled course",
      price: Number(c?.Price ?? c?.price ?? 0),
      createdAt: c?.CreatedAt ?? c?.createdAt ?? "",
      avgRating:
        c?.AvgRating ??
        c?.avgRating ??
        (typeof c?.rating === "number" ? c.rating : null) ??
        null,
    };
  };

  // ---------- SECTIONS ----------
  const fetchSection = async (url: string, setter: any) => {
    try {
      const res = await axiosInstance.get(url);
      const list = Array.isArray(res.data) ? res.data : [];
      setter(list.map(normalizeCourse));
    } catch (err) {
      console.error("Section fetch failed", url, err);
      setter([]);
    }
  };

  // ---------- RECOMMENDATIONS (FIXED) ----------
  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      // 1️⃣ Get IDs
      const recRes = await axiosInstance.get("/Ai/recommendations");
      const ids: number[] = Array.isArray(recRes.data) ? recRes.data : [];

      if (!ids.length) {
        setRecommendations([]);
        return;
      }

      // 2️⃣ Fetch course & rating safely
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const cRes = await axiosInstance.get(`/Courses/${id}`);
            const course = normalizeCourse(cRes.data);

            let rating: number | null = null;
            try {
              const rRes = await axiosInstance.get(`/Courses/rating/${id}`);
              rating =
                typeof rRes?.data?.rating === "number"
                  ? rRes.data.rating
                  : null;
            } catch (e) {
              console.warn("Rating missing for course", id);
            }

            return { ...course, avgRating: rating ?? course.avgRating };
          } catch (e) {
            console.error("Course fetch failed for", id, e);
            return null;
          }
        })
      );

      setRecommendations(results.filter(Boolean) as SimpleCourse[]);
    } catch (err) {
      console.error("Recommendation load failed", err);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // ---------- LOAD ----------
  useEffect(() => {
    fetchRecommendations();

    Promise.all([
      fetchSection("/Courses/toprated", setTopRated),
      fetchSection("/Courses/recent", setRecent),
    ]).finally(() => setLoadingSections(false));
  }, []);

  // ---------- UI ----------
  return (
    <div style={{ padding: 20 }}>
      <h2>Recommended For You</h2>

      {loadingRecommendations ? (
        <p>Loading…</p>
      ) : recommendations.length ? (
        <div style={{ display: "grid", gap: 16 }}>
          {recommendations.map((c) => (
            <CourseCard key={c.courseId} {...c} />
          ))}
        </div>
      ) : (
        <p>No recommendations yet.</p>
      )}

      <h2 style={{ marginTop: 30 }}>Top Rated</h2>
      {loadingSections ? (
        <p>Loading…</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {topRated.map((c) => (
            <CourseCard key={c.courseId} {...c} />
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 30 }}>Recent</h2>
      {loadingSections ? (
        <p>Loading…</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {recent.map((c) => (
            <CourseCard key={c.courseId} {...c} />
          ))}
        </div>
      )}
    </div>
  );
};
