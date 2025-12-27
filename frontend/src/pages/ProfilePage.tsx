import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate(); // <-- Add this
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [editField, setEditField] = useState<null | string>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [biography, setBiography] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  useEffect(() => {
    if (!userId) return;
    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Auth/profile/${userId}`);
        console.log("Profile API response:", response);
        const data = response.data || response;

        setProfile(data);

        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setHeadline(data.headline ?? "");
        setBiography(data.biography ?? "");
        setEmail(data.email ?? "");
        setProfilePictureUrl(data.profilePictureUrl ?? "");
      } catch (err) {
        console.error("Failed to load profile:", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (!currentUser || !userId) {
    return (
      <MainLayout>
        <p>
          You are not logged in. Please <a href="/login">login</a>.
        </p>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <p>Loading profile...</p>
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
        {/* Profile Header with Instructor Stats Button on the right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1>Profile</h1>
          {profile?.roleId === 2 && (
            <button
              onClick={() => navigate("/instructor")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#646cff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Instructor Stats
            </button>
          )}
        </div>

        {/* Profile Picture */}
        <section style={{ marginBottom: 30 }}>
          <h2>Profile Picture</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={profilePictureUrl || "/fallback-profile.png"}
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
          {["firstName", "lastName", "headline", "biography"].map((field) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
              {editField === field ? (
                <>
                  {field === "biography" ? (
                    <textarea
                      value={biography}
                      onChange={(e) => setBiography(e.target.value)}
                      style={{ width: "70%", minHeight: 100 }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        field === "firstName" ? firstName :
                        field === "lastName" ? lastName : headline
                      }
                      onChange={(e) => {
                        if (field === "firstName") setFirstName(e.target.value);
                        else if (field === "lastName") setLastName(e.target.value);
                        else setHeadline(e.target.value);
                      }}
                    />
                  )}
                  <button onClick={() => handleSave(field)}>Save</button>
                </>
              ) : (
                <>
                  <span>
                    {field === "firstName" ? firstName :
                     field === "lastName" ? lastName :
                     field === "biography" ? biography :
                     headline}
                  </span>
                  <button onClick={() => setEditField(field)}>Change</button>
                </>
              )}
            </div>
          ))}
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
