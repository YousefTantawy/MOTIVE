import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
// UI Components (keep imports as needed in pages/components)

// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import { PaymentPage } from "./pages/PaymentPage";
import { TestPage } from "./pages/TestPage";
import { NewCoursePage } from "./pages/NewCoursePage";

export default function App() {
  return (
    <Router>
      <div style={{ 
        fontFamily: "Arial, sans-serif", 
        backgroundColor:"#f5f5f5", 
        minHeight:"100vh",
        display:"flex", 
        flexDirection:"column"
      }}>
        <Navbar />

        {/* Main content grows to fill space */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/course/:id" element={<CourseDetailsPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/my-courses" element={<StudentDashboard />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="new-course" element={<NewCoursePage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
