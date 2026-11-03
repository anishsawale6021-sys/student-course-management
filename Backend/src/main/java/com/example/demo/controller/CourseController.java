package com.example.demo.controller;

import com.example.demo.entity.Course;
import com.example.demo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    
    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/courses/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    
    @PostMapping("/admin/courses")
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }


    @PutMapping("/admin/courses/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        return courseService.updateCourse(id, courseDetails);
    }

   
    @DeleteMapping("/admin/courses/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}