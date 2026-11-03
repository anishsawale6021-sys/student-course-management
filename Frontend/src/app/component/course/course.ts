import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';

export interface CourseItem {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  progress?: number;
  isEnrolled?: boolean;
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course.html',
  styleUrl: './course.css'
})
export class CourseComponent implements OnInit {
  courses: CourseItem[] = [];
  enrolledCourseIds: number[] = [];

  // Filter mode: 'all' or 'enrolled'
  selectedFilter: 'all' | 'enrolled' = 'all';

  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    this.loadCoursesAndEnrollments();
  }

  loadCoursesAndEnrollments(): void {
    // 1. Fetch available courses
    this.courseService.getCourses().subscribe({
      next: (coursesData) => {
        // 2. Fetch student's enrollments to match status
        this.enrollmentService.getEnrollments().subscribe({
          next: (enrollmentsData) => {
            // Map enrolled course IDs based on standard backend response structure
            this.enrolledCourseIds = enrollmentsData.map((e: any) => e.course ? e.course.id : e.courseId);

            this.courses = coursesData.map(course => ({
              ...course,
              isEnrolled: this.enrolledCourseIds.includes(course.id),
              progress: this.enrolledCourseIds.includes(course.id) ? 50 : 0
            }));
          },
          error: (err) => {
            console.error('Failed to fetch enrollments:', err);
            this.courses = coursesData; // Fallback to displaying courses without enrollment status
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch courses from backend:', err);
        this.showMessage('Failed to load courses. Please ensure backend is running.', 'error');
      }
    });
  }

  // Getter to return filtered courses based on active tab
  get displayedCourses(): CourseItem[] {
    if (this.selectedFilter === 'enrolled') {
      return this.courses.filter(c => c.isEnrolled);
    }
    return this.courses;
  }

  setFilter(filter: 'all' | 'enrolled'): void {
    this.selectedFilter = filter;
  }

  enrollCourse(course: CourseItem): void {
    if (course.isEnrolled) {
      this.showMessage('You are already enrolled in this course!', 'error'); // Prevents duplicate enrollment
      return;
    }

    // Call backend API to enroll
    this.enrollmentService.enrollCourse(course).subscribe({
      next: () => {
        course.isEnrolled = true;
        course.progress = 0;
        this.showMessage(`Successfully enrolled in ${course.title}!`, 'success');
      },
      error: (err) => {
        console.error('Enrollment error:', err);
        this.showMessage(err.error?.message || 'Failed to enroll in course.', 'error');
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}