import React from "react";

interface Sidebar {
  title: string;
  children: React.ReactNode;
}

interface StudioLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({ children, sidebar }) => (
  <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", flex: 1 }}>
      {sidebar && (
        <aside
          style={{
            width: "250px",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {sidebar}
        </aside>
      )}
      <main
        style={{
          flex: 1,
          padding: "20px",
          paddingTop: "84px",
          backgroundColor: "#f5f5f5",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  </div>
);
