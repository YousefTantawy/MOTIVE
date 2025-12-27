import React, { useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import api from "../lib/axios";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const userId = user?.userId;

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [biography, setBiography] = useState(user?.biography || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || "");

  if (!user || !userId) {
    return (
      <MainLayout>
        <p>You are not logged in. Please <a href="/login">login</a>.</p>
      </MainLayout>
    );
  }

  const handleUpdateDetails = async () => {
    try {
      await api.put(`/Auth/update-details/${userId}`, { firstName, lastName, headline, biography });
      alert("Details updated successfully");
    } catch (err: any) {
      console.error(err);
      alert("Error updating details");
    }
  };

  const handleChangeEmail = async () => {
    try {
      await api.put(`/Auth/change-email/${userId}`, { newEmail: email });
      alert("Email updated successfully");
    } catch (err: any) {
      console.error(err);
      alert("Error updating email");
    }
  };

  const handleChangePassword = async () => {
    try {
      await api.put(`/Auth/change-password/${userId}`, { currentPassword, newPassword });
      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      console.error(err);
      alert("Error changing password");
    }
  };

  const handleUpdatePicture = async () => {
    try {
      await api.put(`/Auth/update-picture/${userId}`, { profilePictureUrl });
      alert("Profile picture updated successfully");
    } catch (err: any) {
      console.error(err);
      alert("Error updating picture");
    }
  };

  return (
    <MainLayout>
      <div style={{ width: "70%", margin: "0 auto", paddingTop: 40 }}>
        {/* Profile Header */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 40 }}>
          <img
            src={profilePictureUrl || "https://via.placeholder.com/120"}
            alt="Profile"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
          />
          <div>
            <h1>{firstName} {lastName}</h1>
            <p style={{ fontSize: 16, color: "#666" }}>{headline || "Your headline here"}</p>
            <p style={{ maxWidth: 500, color: "#444" }}>{biography || "Your biography goes here."}</p>
          </div>
        </div>

        {/* Update Profile Picture */}
        <section style={{ marginBottom: 30 }}>
          <h2>Profile Picture</h2>
          <input
            type="text"
            placeholder="Profile Picture URL"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "50%" }}
          />
          <button onClick={handleUpdatePicture} style={{ padding: "8px 16px" }}>Update Picture</button>
        </section>

        {/* Personal Info */}
        <section style={{ marginBottom: 30 }}>
          <h2>Personal Info</h2>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "50%" }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "50%" }}
          />
          <input
            type="text"
            placeholder="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "70%" }}
          />
          <textarea
            placeholder="Biography"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "70%", minHeight: 100 }}
          />
          <button onClick={handleUpdateDetails} style={{ padding: "8px 16px" }}>Update Details</button>
        </section>

        {/* Email */}
        <section style={{ marginBottom: 30 }}>
          <h2>Email</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "50%" }}
          />
          <button onClick={handleChangeEmail} style={{ padding: "8px 16px" }}>Update Email</button>
        </section>

        {/* Password */}
        <section style={{ marginBottom: 30 }}>
          <h2>Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "50%" }}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ display: "block", marginBottom: 10, padding: 8, width: "50%" }}
          />
          <button onClick={handleChangePassword} style={{ padding: "8px 16px" }}>Change Password</button>
        </section>
      </div>
    </MainLayout>
  );
};
