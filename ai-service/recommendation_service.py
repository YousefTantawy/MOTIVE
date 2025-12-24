import uvicorn
import mysql.connector
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# --- 1. SETUP & MODEL LOADING ---
app = FastAPI(title="LMS Recommendation Engine")

# Load model once on startup
print("Loading AI Model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

# Define the expected JSON input
class SearchRequest(BaseModel):
    user_id: int
    query: string

# --- 2. DATABASE HELPER ---
def get_db_connection():
    return mysql.connector.connect(
        host="DB_HOST_NAME",
        user="DB_USER_NAME",
        password="DB_PASSWORD",  
        database="MOTIVE"   
    )

# --- 3. CACHE COURSES ON STARTUP ---
# We load courses into memory once so we don't hit the DB on every single search.
# In a real app, you might have a refresh endpoint to update this.
def load_courses():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetch Title + Description
        sql = """
            SELECT c.course_id, c.title, cd.description 
            FROM courses c
            JOIN course_descriptions cd ON c.course_id = cd.course_id
        """
        cursor.execute(sql)
        courses = cursor.fetchall()
        conn.close()
        
        # Create Embeddings
        texts = [f"{c['title']} {c['description']}" for c in courses]
        embeddings = model.encode(texts)
        
        return courses, embeddings
    except Exception as e:
        print(f"Error loading courses: {e}")
        return [], []

# Load them now
all_courses, course_embeddings = load_courses()
print(f"System Ready! Loaded {len(all_courses)} courses.")

# --- 4. THE ENDPOINT ---
@app.post("/recommend")
async def get_recommendations(request: SearchRequest):
    if not all_courses:
        raise HTTPException(status_code=500, detail="No courses loaded in memory.")

    # A. Log the search (Adaptive Learning)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO user_search_history (user_id, search_query) VALUES (%s, %s)", 
            (request.user_id, request.query)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Logging failed: {e}") 
        # We don't stop the request just because logging failed

    # B. Calculate Similarity
    query_vec = model.encode([request.query])
    scores = cosine_similarity(query_vec, course_embeddings)[0]

    # Get Top 3
    top_indices = np.argsort(scores)[::-1][:3]
    
    results = []
    for idx in top_indices:
        if scores[idx] > 0.25: # Relevance Threshold
            results.append({
                "course_id": all_courses[idx]['course_id'],
                "title": all_courses[idx]['title'],
                "score": float(scores[idx])
            })

    return results

# --- 5. RUNNER ---
if __name__ == "__main__":
    # We run on port 5000 to match your C# code
    uvicorn.run(app, host="127.0.0.1", port=5000)