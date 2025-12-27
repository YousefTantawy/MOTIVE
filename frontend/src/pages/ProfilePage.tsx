// ProfilePage.tsx
import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();

  if (!user) {
    return (
      <MainLayout>
        <p>You are not logged in. Please <a href="/login">login</a>.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>Profile</h1>
      <div style={{ marginTop: 20 }}>
        <p><strong>Name:</strong> {user.name ?? "N/A"}</p>
        <p><strong>Email:</strong> {user.email ?? "N/A"}</p>
        <p><strong>Role:</strong> {user.role ?? "N/A"}</p>
      </div>
    </MainLayout>
  );
};
