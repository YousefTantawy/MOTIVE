import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LearnLayout } from "../layouts/LearnLayout";
import { VideoPlayer } from "../features/classroom/VideoPlayer";
import { CourseSidebar } from "../features/classroom/CourseSidebar";
import { ProgressHeader } from "../features/classroom/ProgressHeader";
import { Certificate } from "../features/classroom/Certificate";

export const LearnPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [progress, setProgress] = useState(45);
  const [isCompleted, setIsCompleted] = useState(false);

  const mockLessons = [
    { id: "1", title: "Introduction to React", completed: true },
    { id: "2", title: "JSX and Components", completed: true },
    { id: "3", title: "Hooks and State", completed: id === "3" },
    { id: "4", title: "Advanced Patterns", completed: false },
    { id: "5", title: "Final Project", completed: false },
  ];

  useEffect(() => {
    // Simulate progress update
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((p) => Math.min(p + 10, 100));
      } else {
        setIsCompleted(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <LearnLayout>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
        <div>
          <ProgressHeader progress={progress} lessonTitle={mockLessons[0].title} />
          <VideoPlayer videoUrl="https://sample-videos.com/video/sample.mp4" title={mockLessons[0].title} />
          {isCompleted && (
            <Certificate
              studentName="John Doe"
              courseName="React for Beginners"
              completionDate={new Date().toLocaleDateString()}
              certificateId="CERT-001-2025"
            />
          )}
        </div>
        <CourseSidebar lessons={mockLessons} currentLessonId={id || "1"} />
      </div>
    </LearnLayout>
  );
};
