import React, { useState } from "react";
import { UploadWidget } from "../features/studio/UploadWidget";
import { CourseBuilder } from "../features/studio/CourseBuilder";

export const NewCoursePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [objectives, setObjectives] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [sections, setSections] = useState([{ title: "", lessons: [""] }]);

  // (Same handlers as before: addObjective, addRequirement, addSection, addLesson, etc.)

  const handleSaveCourse = () => {
    const courseData = {
      title,
      description,
      price: parseFloat(price) || 0,
      objectives,
      requirements,
      sections,
    };
    console.log("Saved course:", courseData);
    alert("Course saved (mock)");
  };

  return (
    <div>
      <h1>New Course</h1>
      {/* Add inputs here exactly like previous version */}
      <CourseBuilder
        title={title} setTitle={setTitle}
        description={description} setDescription={setDescription}
        price={price} setPrice={setPrice}
        objectives={objectives} setObjectives={setObjectives}
        requirements={requirements} setRequirements={setRequirements}
        sections={sections} setSections={setSections}
      />
      <UploadWidget onUpload={(file) => console.log("Uploaded:", file.name)} />
      <button
        onClick={handleSaveCourse}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: "#646cff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginTop: 20,
        }}
      >
        Save Course
      </button>
    </div>
  );
};
