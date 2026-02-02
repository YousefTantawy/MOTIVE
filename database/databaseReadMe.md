# 📚 Learning Management System – Database Design

## 🎯 Design Goals

- **Highly normalized (3NF)** to eliminate redundancy and ensure consistency
    
- **Flexible and future-proof schema** that supports new features with minimal refactoring
    
- **Clear separation of concerns** between authentication, authorization, content, and analytics
    
- **Role-Based Access Control (RBAC)** for secure permission management
    
- **Auditability & observability** through logging and tracking tables
    
- **Performance-oriented design** using indexes, junction tables, and database views
---
## 🧱 Schema Overview

The schema is logically divided into the following domains:

### 1️⃣ User & Identity Management

- `users`
    
- `roles`
    
- `role_permissions`
    
- `authidentities`
    
- `login_events`
    
- `user_phones`
    
- `user_links`

This separation allows:

- Multiple authentication providers per user (local, OAuth, SSO)
    
- Clean RBAC implementation
    
- Easy extension to MFA, device tracking, or external identity providers

---
### 2️⃣ Role-Based Access Control (RBAC)

The system uses a **true RBAC model**:

```text
Users → Roles → Permissions
```

- Each user has **exactly one role**
    
- Each role can have **many permissions**
    
- Permissions are represented as **slugs**, making them:
    
    - Human-readable
        
    - Easy to map to backend routes or frontend guards
        
    - Simple to extend without schema changes

📌 **Why this is future-proof**  
New roles or permissions can be added **without touching existing tables or user data**, enabling smooth system evolution.

---
### 3️⃣ Course & Content Architecture

Core tables:

- `courses`
    
- `sections`
    
- `lessons`
    
- `lesson_resources`

Supporting tables:

- `course_descriptions`
    
- `course_objectives`
    
- `course_target_audiences`
    
- `course_categories`
    
- `categories` (self-referencing hierarchy)
    
- `course_instructors`

#### Key Design Decisions

- **Hierarchical content structure** (Course → Section → Lesson)
    
- **Order-independent sequencing** using `order_index`
    
- **Separation of descriptive content** from core course data
    
- **Many-to-many relationships** modeled via junction tables

📌 This allows:

- Multiple instructors per course
    
- Nested course categories
    
- Future content types (quizzes, assignments, labs) without schema redesign

---
### 4️⃣ Enrollment, Progress & Certification

- `enrollments`
    
- `lesson_progress`
    
- `certificates`
    
- `payments`

Features supported:

- One enrollment per user per course (enforced by unique constraints)
    
- Granular lesson-level progress tracking
    
- Payment-to-enrollment linkage
    
- Verifiable certificate issuance using unique codes

📌 **Extendability**  
This structure supports:

- Subscription models
    
- Time-limited access
    
- Partial course completion certificates
    
- Refunds and payment retries
---
### 5️⃣ Reviews & Engagement

- `user_reviews`

Highlights:

- One review per user per course
    
- Enforced rating range using `CHECK` constraints
    
- Ready for sentiment analysis, ranking, or moderation extensions
---
### 6️⃣ Auditing & Security Observability

- `audit_logs`
    
- `audit_log_details`

This design captures:

- **Who** performed an action
    
- **What** entity was affected
    
- **Which fields** changed (before/after values)
    
- **When & from where** the action occurred

📌 **Why this matters**

- Compliance & accountability
    
- Debugging and incident analysis
    
- Safe future introduction of admin-level operations
---
## 🧠 Normalization & Data Integrity (3NF)

The schema strictly adheres to **Third Normal Form**:

- No repeating groups
    
- No partial dependencies
    
- No transitive dependencies
    
- All non-key attributes depend **only on the primary key**

Examples:

- Course metadata split from objectives and target audience
    
- Authentication data separated from user profile
    
- Payments linked to enrollments, not users directly

This ensures:

- Minimal redundancy
    
- Easier updates
    
- Strong referential integrity
---
## 📊 Database Views (Read Optimization)

The system includes **predefined views** for common read-heavy operations:

- `view_most_enrolled`
    
- `view_most_recent`
    
- `view_most_trending`
    
- `view_top_rated`

Benefits:

- Encapsulate complex aggregation logic
    
- Improve query readability
    
- Allow performance tuning without touching application code
    
- Serve analytics and dashboards efficiently
---
## 🚀 Future-Proof & Extensible by Design

The schema was intentionally designed to support future enhancements such as:

- Quizzes & assessments
    
- Discussion forums
    
- Instructor revenue analytics
    
- Course bundles & learning paths
    
- Multi-language localization
    
- Advanced recommendation systems

All of this can be achieved **by adding tables**, not modifying existing ones.

---
## 🛠️ Technical Highlights

- InnoDB engine for ACID compliance
    
- Cascading deletes for lifecycle consistency
    
- Strategic indexing for performance
    
- UTF-8 MB4 for full Unicode support
    
- Strict foreign key constraints
---
## ✅ Conclusion

This database design provides a **robust, scalable, and extensible foundation** for a modern Learning Management System.  
It balances **academic correctness (3NF)** with **real-world production needs**, making it suitable for both educational and commercial use.
