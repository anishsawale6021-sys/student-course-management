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

    public Enrollment enrollStudent(Long courseId, String courseTitle, String department, String instructor, String studentName, String studentEmail) {
        // Check for duplicate enrollment rule
        boolean alreadyEnrolled = enrollmentRepository.existsByCourseIdAndStudentEmail(courseId, studentEmail);
        if (alreadyEnrolled) {
            throw new RuntimeException("Student is already enrolled in this course!");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setCourseId(courseId);
        enrollment.setCourseTitle(courseTitle);
        enrollment.setDepartment(department);
        enrollment.setInstructor(instructor);
        enrollment.setStudentName(studentName);
        enrollment.setStudentEmail(studentEmail);
        enrollment.setEnrollmentDate(LocalDate.now());

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getEnrollmentsByStudentEmail(String email) {
        return enrollmentRepository.findByStudentEmail(email);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
}