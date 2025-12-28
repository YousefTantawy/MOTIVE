import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  // ---------- DELETE ACCOUNT ----------
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get(`/Auth/profile/${userId}`);
        const data = response.data || response;

        setProfile(data);

        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setHeadline(data.headline ?? "");
        setBiography(data.biography ?? "");
        setEmail(data.email ?? "");
        setProfilePictureUrl(data.profilePictureUrl ?? "");

        // Fetch phone numbers
        const phoneResp = await axiosInstance.get(`/Auth/${userId}/phones`);
        const phoneData = phoneResp.data?.phoneNumbers?.[0] ?? "";
        setPhoneNumber(phoneData);
      } catch (err) {
        console.error("Failed to load profile:", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // ---------- DELETE COUNTDOWN ----------
  useEffect(() => {
    if (!showDeleteConfirm) return;
    setCountdown(5);

    const i = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(i);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(i);
  }, [showDeleteConfirm]);

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
        case "phoneNumber":
          await axiosInstance.put(`/Auth/${userId}/phones`, { phoneNumbers: [phoneNumber] });
          alert("Phone number updated successfully");
          break;
        case "password":
          await axiosInstance.put(`/Auth/change-password/${userId}`, passwords);
          alert("Password updated successfully");
          setPasswords({ currentPassword: "", newPassword: "" });
          break;
      }
      setEditField(null);
    } catch (err) {
      console.error(err);
      alert("Error updating " + field);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete(`/Auth/${userId}`);
      alert("Your account was deleted successfully.");
      if (authService.logout) authService.logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  return (
    <MainLayout>
      <div style={{ width: "70%", margin: "0 auto", paddingTop: 40 }}>
        {/* Header */}
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
                <input type="text" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} style={{ padding: 8, width: "300px" }} />
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
          {["firstName", "lastName"].map((field) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
              {editField === field ? (
                <>
                  <input
                    type="text"
                    value={field === "firstName" ? firstName : lastName}
                    onChange={(e) => (field === "firstName" ? setFirstName(e.target.value) : setLastName(e.target.value))}
                  />
                  <button onClick={() => handleSave(field)}>Save</button>
                </>
              ) : (
                <>
                  <span>{field === "firstName" ? firstName : lastName}</span>
                  <button onClick={() => setEditField(field)}>Change</button>
                </>
              )}
            </div>
          ))}

          {/* Phone Number */}
          <div style={{ marginBottom: 10 }}>
            <label>Phone Number: </label>
            {editField === "phoneNumber" ? (
              <>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <button onClick={() => handleSave("phoneNumber")}>Save</button>
              </>
            ) : (
              <>
                <span>{phoneNumber || "-"}</span>
                <button onClick={() => setEditField("phoneNumber")}>{phoneNumber ? "Change" : "Add"}</button>
              </>
            )}
          </div>

          {/* Headline & Biography */}
          {["headline", "biography"].map((field) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
              {editField === field ? (
                <>
                  {field === "biography" ? (
                    <textarea value={biography} onChange={(e) => setBiography(e.target.value)} style={{ width: "70%", minHeight: 100 }} />
                  ) : (
                    <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                  )}
                  <button onClick={() => handleSave(field)}>Save</button>
                </>
              ) : (
                <>
                  <span>{field === "biography" ? biography : headline}</span>
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

        {/* Password */}
        <section style={{ marginBottom: 30 }}>
          <h2>Password</h2>
          {editField === "password" ? (
            <>
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                style={{ marginLeft: 10 }}
              />
              <button onClick={() => handleSave("password")}>Save</button>
            </>
          ) : (
            <button onClick={() => setEditField("password")}>Change Password</button>
          )}
        </section>

        {/* --------- DANGER ZONE --------- */}
        <section style={{ marginTop: 50, borderTop: "1px solid #ddd", paddingTop: 20 }}>
          <h2 style={{ color: "red" }}>Danger Zone</h2>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "10px 18px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Delete My Account
            </button>
          ) : (
            <div style={{ marginTop: 10 }}>
              <p>This will permanently delete your account and all related data.</p>
              <p>
                Confirm available in: <strong>{countdown}</strong> seconds
              </p>
              <button
                disabled={countdown > 0}
                onClick={handleDeleteAccount}
                style={{
                  backgroundColor: countdown > 0 ? "#aaa" : "red",
                  color: "white",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: 6,
                  cursor: countdown > 0 ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  marginRight: 10,
                }}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
