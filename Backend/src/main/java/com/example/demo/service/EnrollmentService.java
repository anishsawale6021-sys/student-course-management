package com.example.demo.service;

import com.example.demo.entity.Enrollment;
import com.example.demo.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnrollmentService {

	@Autowired
	private EnrollmentRepository enrollmentRepository;

	public Enrollment enrollStudent(Long courseId, String courseTitle, String instructor, String studentName,
			String studentEmail) {
		// Check for duplicate enrollment rule
		boolean alreadyEnrolled = enrollmentRepository.existsByCourseIdAndStudentEmail(courseId, studentEmail);
		if (alreadyEnrolled) {
			throw new RuntimeException("Student is already enrolled in this course!");
		}

		Enrollment enrollment = new Enrollment();
		enrollment.setCourseId(courseId);
		enrollment.setCourseTitle(courseTitle);
		enrollment.setInstructor(instructor);
		enrollment.setStudentName(studentName);
		enrollment.setStudentEmail(studentEmail);
		enrollment.setEnrollmentDate(LocalDate.now());
		enrollment.setProgress(15); // Default starting progress

		return enrollmentRepository.save(enrollment);
	}

	public List<Enrollment> getEnrollmentsByStudentEmail(String email) {
		return enrollmentRepository.findByStudentEmail(email);
	}

	public List<Enrollment> getAllEnrollments() {
		return enrollmentRepository.findAll();
	}

	// Method to update and persist progress in MySQL
	public Enrollment updateEnrollmentProgress(Long id, Integer progress) {
		Enrollment enrollment = enrollmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));

		enrollment.setProgress(progress);
		return enrollmentRepository.save(enrollment);
	}
}