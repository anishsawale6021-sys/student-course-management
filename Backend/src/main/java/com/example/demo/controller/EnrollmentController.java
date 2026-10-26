package com.example.demo.controller;

import com.example.demo.entity.Enrollment;
import com.example.demo.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // POST /api/courses/{id}/enroll - Enroll in a course[cite: 6]
    @PostMapping("/courses/{id}/enroll")
    public Enrollment enrollCourse(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String courseTitle = requestBody.get("courseTitle");
        String department = requestBody.get("department");
        String instructor = requestBody.get("instructor");
        String studentName = requestBody.get("studentName");
        String studentEmail = requestBody.get("studentEmail");

        return enrollmentService.enrollStudent(id, courseTitle, department, instructor, studentName, studentEmail);
    }

    // GET /api/enrollments - My courses / Student enrollments[cite: 6]
    @GetMapping("/enrollments")
    public List<Enrollment> getEnrollments(@RequestParam(required = false) String email) {
        if (email != null && !email.isEmpty()) {
            return enrollmentService.getEnrollmentsByStudentEmail(email);
        }
        return enrollmentService.getAllEnrollments();
    }
}