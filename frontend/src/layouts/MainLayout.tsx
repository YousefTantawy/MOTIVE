import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <main style={{ flex: 1, padding: "20px", paddingTop: "84px" }}>{children}</main>
  </div>
);
