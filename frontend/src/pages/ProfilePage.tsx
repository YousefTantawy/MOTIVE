import React, { useState, useEffect } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const userId = user?.userId;

  const [profile, setProfile] = useState<any>(null); // full profile from backend
  const [editField, setEditField] = useState<null | string>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [biography, setBiography] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  // Fetch full profile when page loads
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const data = await authService.fetchProfile(userId);
        setProfile(data);

        // Populate state fields
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setHeadline(data.headline || "");
        setBiography(data.biography || "");
        setEmail(data.email || "");
        setProfilePictureUrl(data.profilePictureUrl || "");
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

  const handleSave = async (field: string) => {
    try {
      switch (field) {
        case "firstName":
        case "lastName":
        case "headline":
        case "biography":
          await axiosInstance.put(`/Auth/update-details/${userId}`, { firstName, lastName, headline, biography });
          alert("Details updated successfully");
          break;
        case "email":
          await axiosInstance.put(`/Auth/change-email/${userId}`, { newEmail: email });
          alert("Email updated successfully");
          break;
        case "profilePictureUrl":
          await axiosInstance.put(`/Auth/update-picture/${userId}`, { profilePictureUrl });
          alert("Profile picture updated successfully");
          break;
      }
      setEditField(null);
    } catch (err) {
      console.error(err);
      alert("Error updating " + field);
    }
  };

  return (
    <MainLayout>
      <div style={{ width: "70%", margin: "0 auto", paddingTop: 40 }}>
        {/* ...your JSX remains exactly the same... */}
      </div>
    </MainLayout>
  );
};
