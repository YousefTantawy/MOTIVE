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
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [links, setLinks] = useState<{ platformName: string; url: string }[]>([]);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Styles
  const cardStyle: React.CSSProperties = {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: 30,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 20,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 5,
  };

  const btnStyle: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#646cff",
    color: "#fff",
    cursor: "pointer",
  };

  const saveBtn: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    marginTop: 5,
  };

  // Load profile
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
        setPhoneNumbers(data.phoneNumbers ?? []);
        setLinks(
          data.links?.map((l: any) => ({
            platformName: l.platformName || "",
            url: l.url || "",
          })) ?? []
        );
      } catch (err) {
        console.error("Failed to load profile:", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // Delete countdown
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
          await axiosInstance.put(`/Auth/update-details/${userId}`, {
            firstName,
            lastName,
            headline,
            biography,
          });
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
        case "phoneNumbers":
          await axiosInstance.put(`/Auth/${userId}/phones`, { phoneNumbers });
          alert("Phone numbers updated successfully");
          break;
        case "links":
          await axiosInstance.put(`/Auth/${userId}/links`, { links });
          alert("Links updated successfully");
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1>Profile</h1>
          <div style={{ display: "flex", gap: 10 }}>
            {profile?.roleId === 2 && (
              <button onClick={() => navigate("/instructor")} style={btnStyle}>
                Instructor Stats
              </button>
            )}
            {profile?.roleId === 1 && (
              <button onClick={() => navigate("/admin")} style={btnStyle}>
                Admin Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Profile Picture */}
        <section style={cardStyle}>
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
                  maxLength={255}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                  style={inputStyle}
                />
                <button style={saveBtn} onClick={() => handleSave("profilePictureUrl")}>
                  Save
                </button>
              </>
            ) : (
              <button style={btnStyle} onClick={() => setEditField("profilePictureUrl")}>
                Change
              </button>
            )}
          </div>
        </section>

        {/* Personal Info */}
        <section style={cardStyle}>
          <h2>Personal Info</h2>
          {["firstName", "lastName"].map((field) => (
            <div key={field} style={fieldStyle}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {editField === field ? (
                <>
                  <input
                    type="text"
                    value={field === "firstName" ? firstName : lastName}
                    onChange={(e) =>
                      field === "firstName" ? setFirstName(e.target.value) : setLastName(e.target.value)
                    }
                    style={inputStyle}
                  />
                  <button style={saveBtn} onClick={() => handleSave(field)}>
                    Save
                  </button>
                </>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{field === "firstName" ? firstName : lastName}</span>
                  <button style={btnStyle} onClick={() => setEditField(field)}>
                    Change
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Phone Numbers */}
          <div style={fieldStyle}>
            <label>Phone Numbers</label>
            {editField === "phoneNumbers" ? (
              <>
                {phoneNumbers.map((num, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      value={num}
                      onChange={(e) => {
                        const newNums = [...phoneNumbers];
                        newNums[idx] = e.target.value;
                        setPhoneNumbers(newNums);
                      }}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      onClick={() => setPhoneNumbers(phoneNumbers.filter((_, i) => i !== idx))}
                      style={{ ...btnStyle, backgroundColor: "#ff4d4f" }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button style={btnStyle} onClick={() => setPhoneNumbers([...phoneNumbers, ""])}>
                    + Add Number
                  </button>
                  <button style={saveBtn} onClick={() => handleSave("phoneNumbers")}>
                    Save
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <ul style={{ margin: 0 }}>
                  {phoneNumbers.map((num, idx) => (
                    <li key={idx}>{num}</li>
                  ))}
                </ul>
                <button style={btnStyle} onClick={() => setEditField("phoneNumbers")}>
                  {phoneNumbers.length ? "Change" : "Add"}
                </button>
              </div>
            )}
          </div>

          {/* Links */}
          <div style={fieldStyle}>
            <label>Links</label>
            {editField === "links" ? (
              <>
                {links.map((link, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Platform Name"
                      value={link.platformName}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[idx].platformName = e.target.value;
                        setLinks(newLinks);
                      }}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[idx].url = e.target.value;
                        setLinks(newLinks);
                      }}
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <button
                      onClick={() => setLinks(links.filter((_, i) => i !== idx))}
                      style={{ ...btnStyle, backgroundColor: "#ff4d4f" }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button style={btnStyle} onClick={() => setLinks([...links, { platformName: "", url: "" }])}>
                    + Add Link
                  </button>
                  <button style={saveBtn} onClick={() => handleSave("links")}>
                    Save
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {links.length > 0 ? (
                  <ul style={{ margin: 0 }}>
                    {links.map((link, idx) => (
                      <li key={idx}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.platformName}: {link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No links added.</p>
                )}
                <button style={btnStyle} onClick={() => setEditField("links")}>
                  {links.length ? "Change" : "Add"}
                </button>
              </div>
            )}
          </div>

          {/* Headline & Biography */}
          {["headline", "biography"].map((field) => (
            <div key={field} style={fieldStyle}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {editField === field ? (
                <>
                  {field === "biography" ? (
                    <textarea
                      value={biography}
                      onChange={(e) => setBiography(e.target.value)}
                      style={{ ...inputStyle, minHeight: 100 }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      style={inputStyle}
                    />
                  )}
                  <button style={saveBtn} onClick={() => handleSave(field)}>
                    Save
                  </button>
                </>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{field === "biography" ? biography : headline}</span>
                  <button style={btnStyle} onClick={() => setEditField(field)}>
                    Change
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Email */}
        <section style={cardStyle}>
          <h2>Email</h2>
          <div style={fieldStyle}>
            {editField === "email" ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                <button style={saveBtn} onClick={() => handleSave("email")}>
                  Save
                </button>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{email}</span>
                <button style={btnStyle} onClick={() => setEditField("email")}>
                  Change
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Password */}
        <section style={cardStyle}>
          <h2>Password</h2>
          <div style={fieldStyle}>
            {editField === "password" ? (
              <>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  style={{ ...inputStyle, marginTop: 10 }}
                />
                <button style={saveBtn} onClick={() => handleSave("password")}>
                  Save
                </button>
              </>
            ) : (
              <button style={btnStyle} onClick={() => setEditField("password")}>
                Change Password
              </button>
            )}
          </div>
        </section>

        {/* Danger Zone */}
        <section style={cardStyle}>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{ ...btnStyle, backgroundColor: "red" }}
            >
              Delete My Account
            </button>
          ) : (
            <div>
              <p>This will permanently delete your account and all related data.</p>
              <p>
                Confirm available in: <strong>{countdown}</strong> seconds
              </p>
              <button
                disabled={countdown > 0}
                onClick={handleDeleteAccount}
                style={{
                  ...btnStyle,
                  backgroundColor: countdown > 0 ? "#aaa" : "red",
                  cursor: countdown > 0 ? "not-allowed" : "pointer",
                }}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ ...btnStyle, backgroundColor: "#ccc", color: "#000" }}
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
