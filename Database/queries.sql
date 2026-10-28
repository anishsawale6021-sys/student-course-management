-- Student Course Management System - Verification Queries
USE student_course_management;

-- 1. Display all courses
SELECT * FROM courses;

-- 2. Find courses by instructor
SELECT * FROM courses WHERE instructor = 'Dr. Smith';

-- 3. Count total courses
SELECT COUNT(*) AS total_courses FROM courses;

-- 4. Get enrolled courses for a specific student
SELECT c.id, c.title, c.description, c.instructor, e.enrollment_date, e.progress
FROM courses c
JOIN enrollments e ON c.id = e.course_id
WHERE e.student_email = 'john@example.com';

-- 5. Join users and enrollments
SELECT u.id AS student_id, u.name AS student_name, u.email AS student_email,
       c.id AS course_id, c.title AS course_title, e.enrollment_date
FROM users u
JOIN enrollments e ON u.email = e.student_email
JOIN courses c ON e.course_id = c.id;

-- 6. Find students enrolled in course ID 1
SELECT e.student_name, e.student_email, e.enrollment_date, e.progress
FROM enrollments e
WHERE e.course_id = 1;

-- 7. Check for duplicate enrollments
SELECT student_email, course_id, COUNT(*) AS duplicate_count
FROM enrollments
GROUP BY student_email, course_id
HAVING COUNT(*) > 1;

-- 8. Total enrollments per course
SELECT c.id AS course_id, c.title AS course_title, COUNT(e.id) AS total_enrollments
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title;