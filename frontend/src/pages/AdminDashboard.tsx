import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { authService } from "../services/authService";

const ADMIN_ROLE_ID = 1;

type CountResponse = { students?: number; instructors?: number; courses?: number };
type AuditLog = { logId: number; user: string; action: string; entity: string; targetId: string; time: string; changes: unknown[] };
type LoginEvent = { eventId: number; user: string; email: string; time: string; success: boolean; ip: string; reason: string | null };

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [studentCount, setStudentCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);

  const [deleteUserId, setDeleteUserId] = useState("");
  const [deleteCourseId, setDeleteCourseId] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.roleId !== ADMIN_ROLE_ID) {
      navigate("/", { replace: true });
      return;
    }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, instructorsRes, coursesRes, auditRes, loginRes] = await Promise.all([
        axiosInstance.get<CountResponse>("/Admin/StudentCount"),
        axiosInstance.get<CountResponse>("/Admin/InstructorsCount"),
        axiosInstance.get<CountResponse>("/Admin/CoursesCount"),
        axiosInstance.get<AuditLog[]>("/Admin/AuditLogs"),
        axiosInstance.get<LoginEvent[]>("/Admin/LoginEvents"),
      ]);

      setStudentCount(studentsRes?.students ?? 0);
      setInstructorCount(instructorsRes?.instructors ?? 0);
      setCourseCount(coursesRes?.courses ?? 0);
      setAuditLogs(auditRes ?? []);
      setLoginEvents(loginRes ?? []);
    } catch (err: any) {
      console.error("Failed to load admin data", err);
      setError(err?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId.trim()) return;
    setActionMessage("");
    try {
      const res = await axiosInstance.delete<{ message: string }>(`/Admin/user/${deleteUserId.trim()}`);
      setActionMessage(res?.message || "User deleted.");
      setDeleteUserId("");
      fetchAll();
    } catch (err: any) {
      console.error("Delete user failed", err);
      setActionMessage(err?.message || "Failed to delete user.");
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteCourseId.trim()) return;
    setActionMessage("");
    try {
      const res = await axiosInstance.delete<{ message: string }>(`/Admin/course/${deleteCourseId.trim()}`);
      setActionMessage(res?.message || "Course deleted.");
      setDeleteCourseId("");
      fetchAll();
    } catch (err: any) {
      console.error("Delete course failed", err);
      setActionMessage(err?.message || "Failed to delete course.");
    }
  };

  const formatDate = (value: string) => new Date(value).toLocaleString();

  return (
    <div style={{ padding: "24px", paddingTop: "84px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Admin Dashboard</h1>
      {error && (
        <div style={{ background: "#fdecea", color: "#611a15", padding: "12px", borderRadius: 8, marginBottom: 16, border: "1px solid #f5c6cb" }}>
          {error}
        </div>
      )}
      {actionMessage && (
        <div style={{ background: "#e8f5e9", color: "#1b5e20", padding: "12px", borderRadius: 8, marginBottom: 16, border: "1px solid #c8e6c9" }}>
          {actionMessage}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[{ label: "Students", value: studentCount, color: "#4caf50" }, { label: "Instructors", value: instructorCount, color: "#2196f3" }, { label: "Courses", value: courseCount, color: "#ff9800" }].map((card) => (
          <div key={card.label} style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{loading ? "--" : card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Delete User</h3>
          <input
            value={deleteUserId}
            onChange={(e) => setDeleteUserId(e.target.value)}
            placeholder="User ID"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db", marginBottom: 8 }}
          />
          <button
            onClick={handleDeleteUser}
            style={{ width: "100%", padding: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
            disabled={loading}
          >
            Delete User
          </button>
        </div>

        <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Delete Course</h3>
          <input
            value={deleteCourseId}
            onChange={(e) => setDeleteCourseId(e.target.value)}
            placeholder="Course ID"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db", marginBottom: 8 }}
          />
          <button
            onClick={handleDeleteCourse}
            style={{ width: "100%", padding: 10, background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
            disabled={loading}
          >
            Delete Course
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Audit Logs</h3>
          <button onClick={fetchAll} style={{ padding: "6px 12px", background: "#111", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
            Refresh
          </button>
        </div>
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                {['ID', 'User', 'Action', 'Entity', 'Target', 'Time'].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 12 }}>Loading...</td></tr>
              ) : auditLogs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 12 }}>No audit logs.</td></tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.logId} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 10 }}>{log.logId}</td>
                    <td style={{ padding: 10 }}>{log.user}</td>
                    <td style={{ padding: 10 }}>{log.action}</td>
                    <td style={{ padding: 10 }}>{log.entity}</td>
                    <td style={{ padding: 10 }}>{log.targetId}</td>
                    <td style={{ padding: 10 }}>{formatDate(log.time)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
        <h3 style={{ marginTop: 0 }}>Login Events</h3>
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                {['ID', 'User', 'Email', 'IP', 'Success', 'Reason', 'Time'].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 12 }}>Loading...</td></tr>
              ) : loginEvents.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 12 }}>No login events.</td></tr>
              ) : (
                loginEvents.map((event) => (
                  <tr key={event.eventId} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 10 }}>{event.eventId}</td>
                    <td style={{ padding: 10 }}>{event.user}</td>
                    <td style={{ padding: 10 }}>{event.email}</td>
                    <td style={{ padding: 10 }}>{event.ip}</td>
                    <td style={{ padding: 10 }}>{event.success ? "Yes" : "No"}</td>
                    <td style={{ padding: 10 }}>{event.reason ?? "-"}</td>
                    <td style={{ padding: 10 }}>{formatDate(event.time)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
