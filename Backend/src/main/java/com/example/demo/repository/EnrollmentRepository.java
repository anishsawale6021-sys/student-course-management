package com.example.demo.repository;

import com.example.demo.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByCourseIdAndStudentEmail(Long courseId, String studentEmail);
    List<Enrollment> findByStudentEmail(String studentEmail);
    
    // Added to check if any student is enrolled in a specific course
    boolean existsByCourseId(Long courseId);
}