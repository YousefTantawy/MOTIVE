import React, { useRef, useEffect } from "react";
import axiosInstance from "../lib/axios";

interface VideoLessonProps {
  userId: number;
  courseId: number;
  lessonId: number;
  videoUrl: string;
  lastWatchedSecond: number;
}

export const VideoLesson: React.FC<VideoLessonProps> = ({
  userId,
  courseId,
  lessonId,
  videoUrl,
  lastWatchedSecond,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = lastWatchedSecond;
    }
  }, [lastWatchedSecond]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        const seconds = videoRef.current.currentTime;
        axiosInstance.post("/Dashboard/updateWatchTime", {
          userId,
          courseId,
          lessonId,
          seconds,
        });
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [userId, courseId, lessonId]);

  const handleEnded = () => {
    axiosInstance.post("/Dashboard/completeLessonCheck", {
      userId,
      courseId,
      lessonId,
      isCompleted: true,
    });
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      onEnded={handleEnded}
      style={{ width: "100%" }}
    />
  );
};
