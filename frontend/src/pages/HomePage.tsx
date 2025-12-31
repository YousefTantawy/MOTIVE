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
  const [recommendations, setRecommendations] = useState<SimpleCourse[]>([]);
  const [trending, setTrending] = useState<SimpleCourse[]>([]);
  const [recent, setRecent] = useState<SimpleCourse[]>([]);
  const [bestSellers, setBestSellers] = useState<SimpleCourse[]>([]);
  const [topRated, setTopRated] = useState<SimpleCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveUserId = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const candidate = Number(parsed?.id ?? parsed?.userId);
        if (Number.isFinite(candidate)) return candidate;
      } catch {}
    }

    const storedId = localStorage.getItem("userId");
    const numericId = storedId ? Number(storedId) : NaN;
    return Number.isFinite(numericId) ? numericId : 0;
  };

  const fetchRecommendations = async () => {
    const userId = resolveUserId();
    if (!userId) {
      setRecommendations([]);
      return;
    }

    try {
      const raw = await axiosInstance.post<any>("/Ai/recommendations", userId);
      const payload = typeof raw === "string" ? safeParseJson(raw) : raw;

      if (!payload || payload.status === "cold_start") {
        setRecommendations([]);
        return;
      }

      if (payload.status === "error") {
        setError("Unable to load recommendations");
        return;
      }

      const ids: number[] = Array.isArray(payload.ids) ? payload.ids : [];
      if (!ids.length) {
        setRecommendations([]);
        return;
      }

      const courseResponses = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await axiosInstance.get<any>(`/Courses/${id}`);
            const ratingRes = await axiosInstance.get<any>(
              `/api/Courses/rating/${id}`
            );

            const avgRating =
              typeof ratingRes?.data?.rating === "number"
                ? ratingRes.data.rating
                : null;

            return {
              courseId: Number(
                res?.Id ??
                  res?.CourseId ??
                  res?.courseId ??
                  res?.id ??
                  0
              ),
              title: res?.Title ?? res?.title ?? "Untitled course",
              price: Number(res?.Price ?? res?.price ?? 0),
              createdAt: res?.CreatedAt ?? res?.createdAt ?? "",
              avgRating,
            } as SimpleCourse;
          } catch {
            return null;
          }
        })
      );

      setRecommendations(
        courseResponses.filter(Boolean) as SimpleCourse[]
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  async function fetchSection(
    url: string,
    setter: React.Dispatch<
      React.SetStateAction<SimpleCourse[]>
    >,
    method: "GET" | "POST" = "GET",
    body?: any
  ) {
    try {
      const rawData =
        method === "POST"
          ? await axiosInstance.post<any[]>(url, body)
          : await axiosInstance.get<any[]>(url);

      const data = Array.isArray(rawData?.data)
        ? rawData.data
        : rawData;

      const mapped = data.map((item: any) => ({
        courseId: Number(
          item?.CourseId ?? item?.courseId ?? 0
        ),
        title:
          item?.Title ??
          item?.title ??
          "Untitled course",
        price: Number(item?.Price ?? item?.price ?? 0),
        createdAt:
          item?.CreatedAt ??
          item?.createdAt ??
          "",
        avgRating:
          typeof item?.AvgRating === "number"
            ? item.AvgRating
            : typeof item?.avgRating === "number"
            ? item.avgRating
            : null,
      }));

      setter(mapped);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchRecommendations(),
      fetchSection("/Courses/trending", setTrending),
      fetchSection("/Courses/recent", setRecent),
      fetchSection("/Courses/bestsellers", setBestSellers),
      fetchSection("/Courses/toprated", setTopRated),
    ]).finally(() => setLoading(false));
  }, []);

  const safeParseJson = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center" }}>Loading…</p>
    );
  if (error)
    return (
      <p
        style={{
          color: "red",
          textAlign: "center",
        }}
      >
        {error}
      </p>
    );

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        Welcome at Motive
      </h1>

      <div style={{ marginBottom: 120 }}>
        <CarouselSection
          title="Recommended"
          courses={recommendations}
        />
      </div>
      <div style={{ marginBottom: 120 }}>
        <CarouselSection
          title="Trending"
          courses={trending}
        />
      </div>
      <div style={{ marginBottom: 120 }}>
        <CarouselSection
          title="Recently Added"
          courses={recent}
        />
      </div>
      <div style={{ marginBottom: 120 }}>
        <CarouselSection
          title="Best Sellers"
          courses={bestSellers}
        />
      </div>
      <div style={{ marginBottom: 120 }}>
        <CarouselSection
          title="Top Rated"
          courses={topRated}
        />
      </div>
    </div>
  );
};

const CarouselSection: React.FC<{
  title: string;
  courses: SimpleCourse[];
}> = ({ title, courses }) => {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const cardWidth = 300;
    const gap = 16;
    const scrollAmount =
      (cardWidth + gap) * 4;
    containerRef.current.scrollBy({
      left:
        direction === "right"
          ? scrollAmount
          : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        marginTop: 25,
        position: "relative",
      }}
    >
      <h2
        style={{
          marginLeft: 0,
          marginBottom: 20,
        }}
      >
        {title}
      </h2>

      <div
        style={{ position: "relative" }}
        className="carousel-wrapper"
      >
        <button
          onClick={() => scroll("left")}
          className="carousel-arrow left"
          style={{ ...arrowStyle, left: -10 }}
        >
          ◀
        </button>
        <button
          onClick={() => scroll("right")}
          className="carousel-arrow right"
          style={{ ...arrowStyle, right: -10 }}
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
            <div
              key={c.courseId}
              style={{
                minWidth: 300,
                flexShrink: 0,
              }}
            >
              {renderCourseCard(c)}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .carousel-wrapper {
          position: relative;
        }
        .carousel-arrow {
          transition: opacity 0.3s;
          opacity: 0;
          pointer-events: none;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
        }
        .carousel-wrapper:hover .carousel-arrow {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
};

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

const renderCourseCard = (c: SimpleCourse) => {
  const reviews =
    typeof c.avgRating === "number"
      ? Array.from(
          { length: 5 },
          (_, i) =>
            Math.min(
              Math.max(
                c.avgRating - i,
                0
              ),
              1
            )
        )
      : [0, 0, 0, 0, 0];

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
