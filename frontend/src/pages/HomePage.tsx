import React from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { RatingStars } from "../components/ui/RatingStars";
import { useNavigate } from "react-router-dom";

const dummyCourses = [
  { id: "1", title: "React for Beginners", description: "Learn React step by step.", rating: 5, price: 19 },
  { id: "2", title: "Advanced TypeScript", description: "Deep dive into TS.", rating: 4, price: 29 },
  { id: "3", title: "UI/UX Design Basics", description: "Learn design fundamentals.", rating: 4 },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main style={{
      flex: 1,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
      padding: "40px"
    }}>
      {dummyCourses.map(course => (
        <Card key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <RatingStars rating={course.rating} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
            <Button onClick={() => navigate(`/test`)}>View Course</Button>
          </div>
        </Card>
      ))}
    </main>
  );
};


