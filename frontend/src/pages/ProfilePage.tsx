// ProfilePage.tsx
import React, { useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axios from "axios";

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const userId = user?.userId;

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [headline, setHeadline] = useState("");
  const [biography, setBiography] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  if (!user || !userId) {
    return (
      <MainLayout>
        <p>You are not logged in. Please <a href="/login">login</a>.</p>
      </MainLayout>
    );
  }

  const handleChangePassword = async () => {
    try {
      await axios.put(`/api/Auth/change-password/${userId}`, { currentPassword, newPassword });
      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Error changing password");
    }
  };

  const handleChangeEmail = async () => {
    try {
      await axios.put(`/api/Auth/change-email/${userId}`, { newEmail });
      alert("Email updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating email");
    }
  };

  const handleUpdateDetails = async () => {
    try {
      await axios.put(`/api/Auth/update-details/${userId}`, { firstName, lastName, headline, biography });
      alert("Details updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating details");
    }
  };

  const handleUpdatePicture = async () => {
    try {
      await axios.put(`/api/Auth/update-picture/${userId}`, { profilePictureUrl });
      alert("Profile picture updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating picture");
    }
  };

  return (
    <MainLayout>
      <h1>Profile</h1>

      <div style={{ marginTop: 20 }}>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* Change Password */}
      <section style={{ marginBottom: 30 }}>
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </section>

      {/* Change Email */}
      <section style={{ marginBottom: 30 }}>
        <h2>Change Email</h2>
        <input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <button onClick={handleChangeEmail}>Update Email</button>
      </section>

      {/* Update Details */}
      <section style={{ marginBottom: 30 }}>
        <h2>Update Details</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <textarea
          placeholder="Biography"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8, minHeight: 80 }}
        />
        <button onClick={handleUpdateDetails}>Update Details</button>
      </section>

      {/* Update Profile Picture */}
      <section>
        <h2>Update Profile Picture</h2>
        <input
          type="text"
          placeholder="Profile Picture URL"
          value={profilePictureUrl}
          onChange={(e) => setProfilePictureUrl(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <button onClick={handleUpdatePicture}>Update Picture</button>
      </section>
    </MainLayout>
  );
};
