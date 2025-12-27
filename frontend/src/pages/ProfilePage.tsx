import React, { useState, useEffect } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const userId = user?.userId;

  const [profile, setProfile] = useState<any>(null);
  const [editField, setEditField] = useState<null | string>(null);

  // Fetch profile from API
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Auth/profile/${userId}`);
        setProfile(response.data);
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

  const handleSave = async (field: string) => {
    try {
      switch (field) {
        case "firstName":
        case "lastName":
        case "headline":
        case "biography":
          await axiosInstance.put(`/Auth/update-details/${userId}`, {
            firstName: profile.firstName,
            lastName: profile.lastName,
            headline: profile.headline,
            biography: profile.biography
          });
          alert("Details updated successfully");
          break;
        case "email":
          await axiosInstance.put(`/Auth/change-email/${userId}`, { newEmail: profile.email });
          alert("Email updated successfully");
          break;
        case "profilePictureUrl":
          await axiosInstance.put(`/Auth/update-picture/${userId}`, { profilePictureUrl: profile.profilePictureUrl });
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

        {/* Profile Picture */}
        <section style={{ marginBottom: 30 }}>
          <h2>Profile Picture</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={profile.profilePictureUrl || "https://via.placeholder.com/120"}
              alt="Profile"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
            />
            {editField === "profilePictureUrl" ? (
              <>
                <input
                  type="text"
                  value={profile.profilePictureUrl || ""}
                  onChange={(e) => setProfile({ ...profile, profilePictureUrl: e.target.value })}
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
                <input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                <button onClick={() => handleSave("firstName")}>Save</button>
              </>
            ) : (
              <>
                <span>{profile.firstName}</span>
                <button onClick={() => setEditField("firstName")}>Change</button>
              </>
            )}
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: 10 }}>
            <label>Last Name: </label>
            {editField === "lastName" ? (
              <>
                <input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                <button onClick={() => handleSave("lastName")}>Save</button>
              </>
            ) : (
              <>
                <span>{profile.lastName}</span>
                <button onClick={() => setEditField("lastName")}>Change</button>
              </>
            )}
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 10 }}>
            <label>Headline: </label>
            {editField === "headline" ? (
              <>
                <input type="text" value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} style={{ width: "70%" }} />
                <button onClick={() => handleSave("headline")}>Save</button>
              </>
            ) : (
              <>
                <span>{profile.headline}</span>
                <button onClick={() => setEditField("headline")}>Change</button>
              </>
            )}
          </div>

          {/* Biography */}
          <div style={{ marginBottom: 10 }}>
            <label>Biography: </label>
            {editField === "biography" ? (
              <>
                <textarea value={profile.biography} onChange={(e) => setProfile({ ...profile, biography: e.target.value })} style={{ width: "70%", minHeight: 100 }} />
                <button onClick={() => handleSave("biography")}>Save</button>
              </>
            ) : (
              <>
                <span>{profile.biography}</span>
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
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} style={{ width: "50%" }} />
              <button onClick={() => handleSave("email")}>Save</button>
            </>
          ) : (
            <>
              <span>{profile.email}</span>
              <button onClick={() => setEditField("email")}>Change</button>
            </>
          )}
        </section>

      </div>
    </MainLayout>
  );
};
