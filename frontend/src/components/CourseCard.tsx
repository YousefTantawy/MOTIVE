export interface CourseCardProps {
  courseId: number;
  title: string;
  description: string;
  ratingPercentage?: number; // 0-100
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  title,
  description,
  ratingPercentage = 0
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <h3>{title}</h3>
      <p style={{ fontSize: 14, color: "#555" }} dangerouslySetInnerHTML={{ __html: description }} />

      <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0" }}>
        <div style={{ position: "relative", display: "inline-block", width: 80, height: 16 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                width: 14,
                height: 14,
                border: "1px solid #ccc",
                borderRadius: 2,
                background: "#eee"
              }} />
            ))}
          </div>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${ratingPercentage}%`,
            display: "flex",
            gap: 2,
            overflow: "hidden"
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                width: 14,
                height: 14,
                borderRadius: 2,
                background: "#ffcd3c"
              }} />
            ))}
          </div>
        </div>
        <span style={{ fontSize: 12 }}>{(ratingPercentage / 20).toFixed(1)} / 5.0</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
        <Button onClick={() => navigate(`/course/${courseId}`)}>View Course</Button>
      </div>
    </Card>
  );
};
