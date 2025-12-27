import React, { useState } from "react";
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

  // Initialize state with user info
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [headline, setHeadline] = useState(user.headline || "");
  const [biography, setBiography] = useState(user.biography || "");
  const [email, setEmail] = useState(user.email || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(user.profilePictureUrl || "");

  const [editField, setEditField] = useState<null | string>(null);

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

          {["firstName", "lastName", "headline", "biography"].map((field) => {
            const value = (() => {
              switch (field) {
                case "firstName": return firstName;
                case "lastName": return lastName;
                case "headline": return headline;
                case "biography": return biography;
              }
            })();

            const setValue = (() => {
              switch (field) {
                case "firstName": return setFirstName;
                case "lastName": return setLastName;
                case "headline": return setHeadline;
                case "biography": return setBiography;
              }
            })();

            const isTextarea = field === "biography";
            const inputStyle = { width: field === "headline" || isTextarea ? "70%" : "50%", minHeight: isTextarea ? 100 : undefined, padding: 8 };

            return (
              <div key={field} style={{ marginBottom: 10 }}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
                {editField === field ? (
                  <>
                    {isTextarea ? (
                      <textarea value={value} onChange={(e) => setValue(e.target.value)} style={inputStyle} />
                    ) : (
                      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} style={inputStyle} />
                    )}
                    <button onClick={() => handleSave(field)}>Save</button>
                  </>
                ) : (
                  <>
                    <span>{value || "—"}</span>
                    <button onClick={() => setEditField(field)}>Change</button>
                  </>
                )}
              </div>
            );
          })}
        </section>

        {/* Email */}
        <section style={{ marginBottom: 30 }}>
          <h2>Email</h2>
          {editField === "email" ? (
            <>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "50%", padding: 8 }} />
              <button onClick={() => handleSave("email")}>Save</button>
            </>
          ) : (
            <>
              <span>{email || "—"}</span>
              <button onClick={() => setEditField("email")}>Change</button>
            </>
          )}
        </section>

      </div>
    </MainLayout>
  );
};
