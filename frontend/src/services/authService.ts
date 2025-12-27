// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

export const ProfilePage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId;

  const [user, setUser] = useState<{
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    headline: string;
    biography: string;
    profilePictureUrl: string;
    roleId: number;
  } | null>(null);

  // Track which field is currently editable
  const [editableField, setEditableField] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      authService.fetchCurrentUser(userId).then(setUser).catch(console.error);
    }
  }, [userId]);

  if (!currentUser || !userId) {
    return (
      <MainLayout>
        <p>You are not logged in. Please <a href="/login">login</a>.</p>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <p>Loading profile...</p>
      </MainLayout>
    );
  }

  const handleFieldChange = (field: string, value: string) => {
    setUser((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleUpdateField = async (field: string) => {
    try {
      let endpoint = "";
      let payload: any = {};

      switch (field) {
        case "firstName":
        case "lastName":
        case "headline":
        case "biography":
          endpoint = `/Auth/update-details/${userId}`;
          payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            headline: user.headline,
            biography: user.biography,
          };
          break;
        case "email":
          endpoint = `/Auth/change-email/${userId}`;
          payload = { newEmail: user.email };
          break;
        case "profilePictureUrl":
          endpoint = `/Auth/update-picture/${userId}`;
          payload = { profilePictureUrl: user.profilePictureUrl };
          break;
        default:
          return;
      }

      await axiosInstance.put(endpoint, payload);
      alert(`${field} updated successfully`);
      setEditableField(null);
    } catch (err) {
      console.error(err);
      alert(`Error updating ${field}`);
    }
  };

  return (
    <MainLayout>
      <div style={{ width: "70%", margin: "0 auto", paddingTop: 40 }}>
        {/* Profile Header */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 40 }}>
          <img
            src={user.profilePictureUrl || "https://via.placeholder.com/120"}
            alt="Profile"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
          />
          <div>
            <h1>{user.firstName} {user.lastName}</h1>
            <p style={{ fontSize: 16, color: "#666" }}>{user.headline || "Your headline here"}</p>
            <p style={{ maxWidth: 500, color: "#444" }}>{user.biography || "Your biography goes here."}</p>
          </div>
        </div>

        {/* Profile Fields */}
        {[
          { label: "First Name", field: "firstName" },
          { label: "Last Name", field: "lastName" },
          { label: "Headline", field: "headline" },
          { label: "Biography", field: "biography" },
          { label: "Email", field: "email" },
          { label: "Profile Picture URL", field: "profilePictureUrl" },
        ].map(({ label, field }) => (
          <section key={field} style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: "bold" }}>{label}:</label>
            {editableField === field ? (
              <>
                {field === "biography" ? (
                  <textarea
                    value={user[field]}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    style={{ display: "block", marginBottom: 10, padding: 8, width: "70%", minHeight: 80 }}
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={user[field]}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    style={{ display: "block", marginBottom: 10, padding: 8, width: "50%" }}
                  />
                )}
                <button onClick={() => handleUpdateField(field)} style={{ padding: "6px 12px" }}>Save</button>
                <button onClick={() => setEditableField(null)} style={{ padding: "6px 12px", marginLeft: 8 }}>Cancel</button>
              </>
            ) : (
              <span style={{ marginLeft: 10 }}>
                {field === "profilePictureUrl" ? (
                  <a href={user[field]} target="_blank" rel="noreferrer">View</a>
                ) : (
                  user[field] || "—"
                )}
                <button onClick={() => setEditableField(field)} style={{ marginLeft: 10, padding: "4px 8px" }}>Change</button>
              </span>
            )}
          </section>
        ))}
      </div>
    </MainLayout>
  );
};
