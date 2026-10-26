Enter password: *****
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 29
Server version: 9.1.0 MySQL Community Server - GPL

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+---------------------------+
| Database                  |
+---------------------------+
| ai_study_recommendation   |
| amazon                    |
| attendence                |
| batch426                  |
| bookmanage                |
| customersp                |
| employee1                 |
| employee2                 |
| employeeinter             |
| employeeinterview         |
| employeetest              |
| expense_db                |
| expenseiq                 |
| grocery_management_db     |
| hibernate                 |
| hospidata                 |
| hospitalsp                |
| information_schema        |
| infusyx                   |
| intern_management_db      |
| interview_practice        |
| jparepo                   |
| learning                  |
| librarydata               |
| myemployee                |
| mysql                     |
| performance_schema        |
| practice_db               |
| practice_sales            |
| quiz_app                  |
| quiz_expense_db           |
| quizgame                  |
| quizmaster                |
| soal                      |
| spring_boot_15_09_2026    |
| student_course_management |
| studentinfo               |
| studentsportal            |
| studerror                 |
| taskmanager               |
+---------------------------+
40 rows in set (0.00 sec)

mysql> use student_course_management;
Database changed
mysql> SELECT * FROM courses;
+----+------------------+------------------------------------------------------------+----------+------------+------------------------------+
| id | department       | description                     | duration | instructor | title            |
+----+------------------+------------------------------------------------------------+----------+------------+------------------------------+
|  1 | Computer Science | Learn fundamental data structures andcomplexity analysis. | 12 Weeks | Dr. Smith  | Data Structures & Algorithms |
|  2 | Computer Science | Learn advanced backend development with Spring Boot.       | 4 Weeks  | Dr. Smith  | Spring Boot Microservices    |
+----+------------------+------------------------------------------------------------+----------+------------+------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT * FROM courses
    -> WHERE instructor = 'Dr. Smith';
+----+------------------+------------------------------------------------------------+----------+------------+------------------------------+
| id | department       | description                     | duration | instructor | title            |
+----+------------------+------------------------------------------------------------+----------+------------+------------------------------+
|  1 | Computer Science | Learn fundamental data structures andcomplexity analysis. | 12 Weeks | Dr. Smith  | Data Structures & Algorithms |
|  2 | Computer Science | Learn advanced backend development with Spring Boot.       | 4 Weeks  | Dr. Smith  | Spring Boot Microservices    |
+----+------------------+------------------------------------------------------------+----------+------------+------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT COUNT(*) AS total_courses
    -> FROM courses;
+---------------+
| total_courses |
+---------------+
|             2 |
+---------------+
1 row in set (0.00 sec)

mysql> SELECT c.id, c.title, c.description, c.instructor, e.enrollment_date, e.progress
    -> FROM courses c
    -> JOIN enrollments e ON c.id = e.course_id
    -> WHERE e.student_email = 'john@example.com';
+----+------------------------------+------------------------------------------------------------+------------+-----------------+----------+
| id | title                        | description                                 | instructor | enrollment_date| progress |
+----+------------------------------+------------------------------------------------------------+------------+-----------------+----------+
|  1 | Data Structures & Algorithms | Learn fundamental data structures and complexity analysis. | Dr. Smith  | 2026-10-26|     NULL |
+----+------------------------------+------------------------------------------------------------+------------+-----------------+----------+
1 row in set (0.00 sec)

mysql> SELECT u.id AS student_id, u.name AS student_name, u.email AS student_email,
    ->        c.id AS course_id, c.title AS course_title, e.enrollment_date
    -> FROM users u
    -> JOIN enrollments e ON u.email = e.student_email
    -> JOIN courses c ON e.course_id = c.id;
+------------+--------------+------------------+-----------+------------------------------+-----------------+
| student_id | student_name | student_email    | course_id | course_title                 | enrollment_date |
+------------+--------------+------------------+-----------+------------------------------+-----------------+
|          2 | John Doe     | john@example.com |         1 | Data Structures & Algorithms | 2026-10-26      |
+------------+--------------+------------------+-----------+------------------------------+-----------------+
1 row in set (0.00 sec)

mysql> SELECT e.student_name, e.student_email, e.enrollment_date, e.progress
    -> FROM enrollments e
    -> WHERE e.course_id = 1;
+--------------+------------------+-----------------+----------+
| student_name | student_email    | enrollment_date | progress |
+--------------+------------------+-----------------+----------+
| John Doe     | john@example.com | 2026-10-26      |     NULL |
+--------------+------------------+-----------------+----------+
1 row in set (0.00 sec)

mysql> SELECT student_email, course_id, COUNT(*) AS duplicate_count
    -> FROM enrollments
    -> GROUP BY student_email, course_id
    -> HAVING COUNT(*) > 1;
Empty set (0.00 sec)

mysql> SELECT c.id AS course_id, c.title AS course_title, COUNT(e.id) AS total_enrollments
    -> FROM courses c
    -> LEFT JOIN enrollments e ON c.id = e.course_id
    -> GROUP BY c.id, c.title;
+-----------+------------------------------+-------------------+
| course_id | course_title                 | total_enrollments |
+-----------+------------------------------+-------------------+
|         1 | Data Structures & Algorithms |                 1 |
|         2 | Spring Boot Microservices    |                 0 |
+-----------+------------------------------+-------------------+
2 rows in set (0.00 sec)

mysql>
