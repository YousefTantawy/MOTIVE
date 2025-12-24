import React from "react";

interface LearnLayoutProps {
  children: React.ReactNode;
}

export const LearnLayout: React.FC<LearnLayoutProps> = ({ children }) => (
  <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <main style={{ flex: 1, padding: "20px", paddingTop: "84px", backgroundColor: "#fff" }}>{children}</main>
  </div>
);
