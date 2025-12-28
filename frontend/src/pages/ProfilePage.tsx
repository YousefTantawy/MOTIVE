// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { authService } from "../services/authService";
import axiosInstance from "../lib/axios";

interface ProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
}

interface PhoneNumbersResponse {
  phoneNumbers: string[];
}

const ProfilePage: React.FC = () => {
  const userId = authService.getUserId();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [editingLastName, setEditingLastName] = useState(false);

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  // PHONE
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  // PASSWORD
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // --- LOAD PROFILE ---
        const res = await axiosInstance.get<ProfileResponse>(
          `/api/Auth/${userId}`
        );
        setProfile(res.data);
        setFirstNameInput(res.data.firstName);
        setLastNameInput(res.data.lastName);

        // --- LOAD PHONE ---
        const phoneRes = await axiosInstance.get<PhoneNumbersResponse>(
          `/api/Auth/${userId}/phones`
        );
        setPhoneNumber(phoneRes.data.phoneNumbers?.[0] || "");

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // --- SAVE FIRST NAME ---
  const saveFirstName = async () => {
    await axiosInstance.put(`/api/Auth/${userId}/first-name`, {
      firstName: firstNameInput,
    });
    setProfile((prev) =>
      prev ? { ...prev, firstName: firstNameInput } : prev
    );
    setEditingFirstName(false);
  };

  // --- SAVE LAST NAME ---
  const saveLastName = async () => {
    await axiosInstance.put(`/api/Auth/${userId}/last-name`, {
      lastName: lastNameInput,
    });
    setProfile((prev) =>
      prev ? { ...prev, lastName: lastNameInput } : prev
    );
    setEditingLastName(false);
  };

  // --- SAVE PHONE ---
  const savePhone = async () => {
    await axiosInstance.put(`/api/Auth/${userId}/phones`, {
      phoneNumbers: [phoneInput.trim()],
    });
    setPhoneNumber(phoneInput.trim());
    setEditingPhone(false);
  };

  // --- CHANGE PASSWORD ---
  const changePassword = async () => {
    await axiosInstance.post(`/api/Auth/change-password/${userId}`, {
      currentPassword,
      newPassword,
    });

    setEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  if (loading || !profile) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2>Profile</h2>

        {/* FIRST NAME */}
        <div>
          <label>First Name:</label>
          {!editingFirstName ? (
            <div>
              {profile.firstName}
              <button onClick={() => setEditingFirstName(true)}>Change</button>
            </div>
          ) : (
            <div>
              <input
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
              />
              <button onClick={saveFirstName}>Save</button>
              <button onClick={() => setEditingFirstName(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* LAST NAME */}
        <div>
          <label>Last Name:</label>
          {!editingLastName ? (
            <div>
              {profile.lastName}
              <button onClick={() => setEditingLastName(true)}>Change</button>
            </div>
          ) : (
            <div>
              <input
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
              />
              <button onClick={saveLastName}>Save</button>
              <button onClick={() => setEditingLastName(false)}>Cancel</button>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label>Email:</label>
          <div>{profile.email}</div>
        </div>

        {/* PHONE NUMBER */}
        <div>
          <label>Phone Number:</label>

          {!editingPhone ? (
            <div>
              {phoneNumber || "No phone number added"}
              <button
                onClick={() => {
                  setPhoneInput(phoneNumber);
                  setEditingPhone(true);
                }}
              >
                {phoneNumber ? "Change" : "Add"}
              </button>
            </div>
          ) : (
            <div>
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              <button onClick={savePhone}>Save</button>
              <button onClick={() => setEditingPhone(false)}>Cancel</button>
            </div>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label>Password:</label>

          {!editingPassword ? (
            <div>
              ********
              <button onClick={() => setEditingPassword(true)}>Change</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <div>
                <button onClick={changePassword}>Save</button>
                <button onClick={() => setEditingPassword(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
