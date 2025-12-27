// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const userId = user?.userId;

  if (!user || !userId) {
    return (
      <MainLayout>
        <p>You are not logged in. Please <a href="/login">login</a>.</p>
      </MainLayout>
    );
  }

  // State for API profile and editable fields
  const [profile, setProfile] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [biography, setBiography] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [editField, setEditField] = useState<null | string>(null); // tracks editable field

  // Load profile from API
useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await axiosInstance.get(`/Auth/profile/${userId}`);
      // Safely get data, fallback to empty object if undefined
      const data = response?.data || {};
      setProfile(data);
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
      setEditField(null); // exit edit mode
    } catch (err) {
      console.error(err);
      alert("Error updating " + field);
    }
  };

  if (!profile) {
    return (
      <MainLayout>
        <p>Loading profile...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ width: "70%", margin: "0 auto", paddingTop: 40 }}>

        {/* Profile Picture */}
        <section style={{ marginBottom: 30 }}>
          <h2>Profile Picture</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={profilePictureUrl || "https://via.placeholder.com/120"}
              alt="Profile"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
            />
            {editField === "profilePictureUrl" ? (
              <>
                <input
                  type="text"
                  value={profilePictureUrl}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                  style={{ padding: 8, width: "300px" }}
                />
                <button onClick={() => handleSave("profilePictureUrl")}>Save</button>
              </>
            ) : (
              <button onClick={() => setEditField("profilePictureUrl")}>Change</button>
            )}
          </div>
        </section>

        {/* Personal Info */}
        <section style={{ marginBottom: 30 }}>
          <h2>Personal Info</h2>

          {/* First Name */}
          <div style={{ marginBottom: 10 }}>
            <label>First Name: </label>
            {editField === "firstName" ? (
              <>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <button onClick={() => handleSave("firstName")}>Save</button>
              </>
            ) : (
              <>
                <span>{firstName}</span>
                <button onClick={() => setEditField("firstName")}>Change</button>
              </>
            )}
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: 10 }}>
            <label>Last Name: </label>
            {editField === "lastName" ? (
              <>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <button onClick={() => handleSave("lastName")}>Save</button>
              </>
            ) : (
              <>
                <span>{lastName}</span>
                <button onClick={() => setEditField("lastName")}>Change</button>
              </>
            )}
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 10 }}>
            <label>Headline: </label>
            {editField === "headline" ? (
              <>
                <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} style={{ width: "70%" }} />
                <button onClick={() => handleSave("headline")}>Save</button>
              </>
            ) : (
              <>
                <span>{headline}</span>
                <button onClick={() => setEditField("headline")}>Change</button>
              </>
            )}
          </div>

          {/* Biography */}
          <div style={{ marginBottom: 10 }}>
            <label>Biography: </label>
            {editField === "biography" ? (
              <>
                <textarea value={biography} onChange={(e) => setBiography(e.target.value)} style={{ width: "70%", minHeight: 100 }} />
                <button onClick={() => handleSave("biography")}>Save</button>
              </>
            ) : (
              <>
                <span>{biography}</span>
                <button onClick={() => setEditField("biography")}>Change</button>
              </>
            )}
          </div>
        </section>

        {/* Email */}
        <section style={{ marginBottom: 30 }}>
          <h2>Email</h2>
          {editField === "email" ? (
            <>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "50%" }} />
              <button onClick={() => handleSave("email")}>Save</button>
            </>
          ) : (
            <>
              <span>{email}</span>
              <button onClick={() => setEditField("email")}>Change</button>
            </>
          )}
        </section>

      </div>
    </MainLayout>
  );
};
