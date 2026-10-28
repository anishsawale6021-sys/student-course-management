# Student Course Management System (EduPortal)
An Ed-Tech platform built as part of the SETTribe Internship Assessment[cite: 1].

## 🚀 Tech Stack
* **Frontend:** Angular, TypeScript, Angular Router, HttpClient, Tailwind/CSS[cite: 1]
* **Backend:** Java, Spring Boot, Spring Web, Spring Data JPA[cite: 1]
* **Database:** MySQL[cite: 1]
* **Security & Persistence:** Angular Auth Guards, RESTful APIs, MySQL Database-backed enrollment & progress tracking[cite: 1]

---

## 📋 Project Features
* **Student & Admin Authentication:** Secure login with Angular Route Guards protecting protected routes.
* **Role-Based Dashboards:** 
  * *Student Dashboard:* Browse course catalogs, search/filter courses, enroll, track progress interactively (syncs and persists to MySQL), and manage profile details.
  * *Admin Dashboard:* Manage course CRUD operations and monitor platform data.
* **Business Logic & Rules:** Prevents duplicate course enrollments for students[cite: 1, 2].
* **Architecture:** Implements a strict Controller -> Service -> Repository design pattern[cite: 1].

---

## 🛠️ Setup & Installation Instructions

### Prerequisites
* Java JDK 17 or higher[cite: 1]
* Node.js & npm (for Angular frontend)
* MySQL Server[cite: 1]

### 1. Database Setup
1. Open your MySQL client and create the database[cite: 7]:
   ```sql
   CREATE DATABASE student_course_management;
   USE student_course_management;