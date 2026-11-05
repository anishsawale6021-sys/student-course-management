package com.example.demo.controller;

import com.example.demo.entity.Enrollment;
import com.example.demo.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EnrollmentController {

	@Autowired
	private EnrollmentService enrollmentService;


	@PostMapping("/courses/{id}/enroll")
	public Enrollment enrollCourse(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
		String courseTitle = requestBody.get("courseTitle");
		String instructor = requestBody.get("instructor");
		String studentName = requestBody.get("studentName");
		String studentEmail = requestBody.get("studentEmail");

		return enrollmentService.enrollStudent(id, courseTitle, instructor, studentName, studentEmail);
	}


	@GetMapping("/enrollments")
	public List<Enrollment> getEnrollments(@RequestParam(required = false) String email) {
		if (email != null && !email.isEmpty()) {
			return enrollmentService.getEnrollmentsByStudentEmail(email);
		}
		return enrollmentService.getAllEnrollments();
	}

	
	@PutMapping("/enrollments/{id}/progress")
	public Enrollment updateProgress(@PathVariable Long id, @RequestBody Map<String, Integer> requestBody) {
		Integer progress = requestBody.get("progress");
		return enrollmentService.updateEnrollmentProgress(id, progress);
	}
}