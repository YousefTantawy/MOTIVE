import React, { useState, useEffect } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const userId = user?.userId;

  const [profile, setProfile] = useState<any>(null);
  const [editField, setEditField] = useState<null | string>(null);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const data = await authService.fetchProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, [userId]);

  if (!user || !userId) {
    return (
      <MainLayout>
        <p>You are not logged in. Please <a href="/login">login</a>.</p>
      </MainLayout>
    );
  }

  if (!profile) {
    return <MainLayout><p>Loading profile...</p></MainLayout>;
  }

  return (
    <MainLayout>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </MainLayout>
  );
};
