# Student Course Management System
An Ed-Tech platform built as part of the SETTribe Internship Assessment[cite: 1].

## 🚀 Tech Stack
* **Frontend:** React.js / Angular, Router, Axios, CSS[cite: 1]
* **Backend:** Java 17+, Spring Boot, Spring Web, Spring Data JPA[cite: 1]
* **Database:** MySQL[cite: 1]
* **Authentication:** Session / Token-based security[cite: 1]

---

## 📋 Project Features
* **Student Authentication:** Registration, login, and secure logout[cite: 1, 2].
* **Role-Based Access:** Student dashboard for browsing and enrolling in courses; Admin dashboard for managing course CRUD operations[cite: 1, 2].
* **Business Logic:** Prevents duplicate course enrollments for students[cite: 1, 2].
* **Architecture:** Implements a strict Controller -> Service -> Repository pattern[cite: 1].

---

## 🛠️ Setup & Installation Instructions

### Prerequisites
* Java JDK 17 or higher installed[cite: 1].
* Node.js & npm installed (for frontend).
* MySQL Server installed[cite: 1].

### 1. Database Setup
1. Open your MySQL client and create the database:
   ```sql
   CREATE DATABASE student_course_management;