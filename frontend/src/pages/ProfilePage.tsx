import React, { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const userId = user?.userId;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [biography, setBiography] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
      try {
        const fullUser = await authService.fetchCurrentUser(userId);
        setFirstName(fullUser.firstName || "");
        setLastName(fullUser.lastName || "");
        setHeadline(fullUser.headline || "");
        setBiography(fullUser.biography || "");
        setEmail(fullUser.email || "");
        setProfilePictureUrl(fullUser.profilePictureUrl || "");
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
  }, [userId]);

  if (!userId) {
    return (
      <MainLayout>
        <p>You are not logged in. Please <a href="/login">login</a>.</p>
      </MainLayout>
    );
  }

  // Add your handleUpdateDetails, handleChangeEmail, etc.
  // Use axiosInstance.put for all API calls
};
