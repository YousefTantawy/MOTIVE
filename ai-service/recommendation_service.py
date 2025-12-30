import uvicorn
import mysql.connector
import os
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

class UserRequest(BaseModel):
    user_id: int

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "motivedatabase.mysql.database.azure.com"),
        user=os.getenv("DB_USER", "YousefTantawy"),
        password=os.getenv("DB_PASSWORD", "el7amamsyel7amamsy!!"),
        database=os.getenv("DB_NAME", "lms_db")
    )

# --- LOAD AI MEMORY (Startup) ---
def load_vectors():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetch only what is needed for Math (ID + Text)
        cursor.execute("""
            SELECT c.course_id, c.title, cd.description 
            FROM courses c
            JOIN course_descriptions cd ON c.course_id = cd.course_id
        """)
        courses = cursor.fetchall()
        conn.close()
        
        ids = [c['course_id'] for c in courses]
        texts = [f"{c['title']} {c['description']}" for c in courses]
        embeddings = model.encode(texts) # type: ignore
        return ids, embeddings
    except Exception as e:
        print(f"Startup Error: {e}")
        return [], []

all_ids, all_vectors = load_vectors()

# --- THE ENDPOINT ---
@app.post("/get-ids")
def get_recommendation_ids(request: UserRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1. Get User History
        cursor.execute("SELECT course_id FROM enrollments WHERE user_id = %s", (request.user_id,))
        rows = cursor.fetchall()
        enrolled_ids = [r['course_id'] for r in rows]

        # COLD START: If no history, return empty list (Let .NET decide what to show)
        if not enrolled_ids:
            return {"status": "cold_start", "ids": []}

        # 2. Calculate Profile
        user_vectors = []
        for eid in enrolled_ids:
            if eid in all_ids:
                idx = all_ids.index(eid)
                user_vectors.append(all_vectors[idx])
        
        if not user_vectors:
            return {"status": "error", "ids": []}

        # 3. Find Similar Vectors
        user_profile = np.mean(user_vectors, axis=0)
        scores = cosine_similarity([user_profile], all_vectors)[0]
        top_indices = np.argsort(scores)[::-1]

        # 4. Filter & Return IDs Only
        recommended_ids = []
        for idx in top_indices:
            rec_id = all_ids[idx]
            if rec_id not in enrolled_ids:
                recommended_ids.append(rec_id)
            if len(recommended_ids) >= 8: break 

        return {"status": "success", "ids": recommended_ids}

    finally:
        conn.close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5171))
    uvicorn.run(app, host="0.0.0.0", port=port)