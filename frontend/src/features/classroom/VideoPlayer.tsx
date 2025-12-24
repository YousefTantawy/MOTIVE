import React from "react";
import { Spinner } from "../../components/ui/Spinner";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  isLoading?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, isLoading = false }) => (
  <div
    style={{
      backgroundColor: "#000",
      borderRadius: "8px",
      overflow: "hidden",
      marginBottom: "20px",
    }}
  >
    {isLoading ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Spinner />
      </div>
    ) : (
      <>
        <video
          controls
          style={{ width: "100%", height: "auto" }}
          src={videoUrl}
        />
        <div style={{ padding: "16px" }}>
          <h2>{title}</h2>
        </div>
      </>
    )}
  </div>
);
