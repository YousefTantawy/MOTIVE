import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface Section {
  id: string;
  title: string;
  lessons: { id: string; title: string }[];
}

interface CourseBuilderProps {
  onSave?: (sections: Section[]) => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({ onSave }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const addSection = () => {
    if (newSectionTitle.trim()) {
      setSections([
        ...sections,
        { id: Date.now().toString(), title: newSectionTitle, lessons: [] },
      ]);
      setNewSectionTitle("");
    }
  };

  const handleSave = () => {
    onSave?.(sections);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Build Your Course</h2>
      <div style={{ marginBottom: "20px" }}>
        <Input
          label="Section Title"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="e.g., Introduction, Advanced Topics"
        />
        <Button onClick={addSection}>Add Section</Button>
      </div>
      <div>
        {sections.map((section) => (
          <div
            key={section.id}
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          >
            <h3>{section.title}</h3>
            <p style={{ fontSize: "12px", color: "#666" }}>{section.lessons.length} lessons</p>
          </div>
        ))}
      </div>
      <Button onClick={handleSave}>Save Course</Button>
    </div>
  );
};
