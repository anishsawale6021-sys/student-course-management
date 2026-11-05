import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { AuthService } from '../../services/auth.service';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboardComponent implements OnInit {
  currentView: string = 'catalog';

  studentName: string = 'Student';
  studentEmail: string = '';
  studentPhone: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  isLoading: boolean = false;
  enrollingCourseId: number | null = null;
  searchTerm: string = '';

  showAnnouncement: boolean = true;
  announcementText: string = '';
  selectedLevel: string = 'All';
  recentActivities: any[] = [];

  courses: any[] = [];
  enrolledCourses: any[] = [];

  isDetailsModalOpen: boolean = false;
  selectedCourseDetails: any = null;

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadStudentProfile();
    this.loadDashboardData();
    this.loadAnnouncement();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  }

  confirmLogout(event: Event): void {
    event.preventDefault();
    void Swal.fire({
      icon: 'warning',
      title: 'Log out?',
      text: 'Are you sure you want to log out of EduPortal?',
      showCancelButton: true,
      confirmButtonText: 'Log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (!result.isConfirmed) return;
      ['authToken', 'currentUser', 'currentUserName', 'currentUserEmail', 'currentUserRole', 'currentUserPhone', 'portalAnnouncement']
        .forEach((name) => deleteCookie(name));
      this.router.navigate(['/login']);
    });
  }

  loadAnnouncement(): void {
    this.announcementText = getCookie('portalAnnouncement') || 'Welcome to EduPortal! Check out our latest available courses.';
  }

  dismissAnnouncement(): void {
    this.showAnnouncement = false;
  }

  setLevelFilter(level: string): void {
    this.selectedLevel = level;
    this.cdr.detectChanges();
  }

  loadStudentProfile(): void {
    this.studentName = getCookie('currentUserName') || 'Radha';
    this.studentEmail = getCookie('currentUserEmail') || 'radha@gmail.com';

    const savedPhone = getCookie('currentUserPhone') || '';
    this.studentPhone = /^\d+$/.test(savedPhone) ? savedPhone : '';
  }

  loadDashboardData(): void {
    this.loadCatalogCourses();
    this.loadEnrolledCourses();
  }

  loadCatalogCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = (data || []).map(c => ({
          ...c,
          level: c.level || (c.id % 3 === 0 ? 'Advanced' : c.id % 2 === 0 ? 'Intermediate' : 'Beginner')
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
        void Swal.fire({ icon: 'error', title: 'Unable to load courses', text: 'Unable to fetch the course catalog.' });
      }
    });
  }

  loadEnrolledCourses(): void {
    // Pass the logged-in student's email to fetch only their enrollments
    this.enrollmentService.getEnrollments(this.studentEmail).subscribe({
      next: (data) => {
        this.enrolledCourses = (data || []).map((e: any) => ({
          id: e.id,
          courseId: e.course ? e.course.id : (e.courseId || e.id),
          courseTitle: e.course ? e.course.title : e.courseTitle,
          instructor: e.course ? e.course.instructor : e.instructor,
          date: e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : (e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : 'Recently'),
          progress: e.progress ?? 15
        }));

        this.updateRecentActivities();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load enrollments:', err);
      }
    });
  }

  updateRecentActivities(): void {
    const activities = [];
    if (this.enrolledCourses.length > 0) {
      activities.push({
        icon: '🎓',
        text: `Enrolled in "${this.enrolledCourses[0].courseTitle}"`,
        time: this.enrolledCourses[0].date
      });
    }
    activities.push({
      icon: '🔐',
      text: 'Successfully logged into EduPortal',
      time: 'Today'
    });
    this.recentActivities = activities;
  }

  switchView(view: string): void {
    this.currentView = view;
    if (view === 'catalog' || view === 'enrolled') {
      this.loadDashboardData();
    }
  }

  get filteredCourses() {
    if (!this.courses || !Array.isArray(this.courses)) return [];
    let filtered = this.courses;
    const search = (this.searchTerm || '').toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(c =>
        (c.title || '').toLowerCase().includes(search) ||
        (c.instructor || '').toLowerCase().includes(search)
      );
    }
    if (this.selectedLevel !== 'All') {
      filtered = filtered.filter(c => c.level === this.selectedLevel);
    }
    return filtered;
  }

  applyFilters(): void {
    this.cdr.detectChanges();
  }

  openCourseDetails(course: any, event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedCourseDetails = course;
    this.isDetailsModalOpen = true;
    this.cdr.detectChanges();
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedCourseDetails = null;
    this.cdr.detectChanges();
  }

  isEnrolled(courseId: number): boolean {
    return this.enrolledCourses.some(e => e.courseId === courseId);
  }

  enrollCourse(course: any, event?: Event): void {
    if (event) event.stopPropagation();
    const courseId = course.id || course.courseId;
    const courseTitle = course.title || course.courseTitle;
    if (!course || !courseId) return;

    if (this.isEnrolled(courseId)) {
      void Swal.fire({ icon: 'error', title: 'Already enrolled', text: 'You are already enrolled in this course!' });
      return;
    }

    this.enrollingCourseId = courseId;
    this.enrollmentService.enrollCourse(course).subscribe({
      next: () => {
        this.enrollingCourseId = null;
        void Swal.fire({ icon: 'success', title: 'Enrollment successful', text: `You are now enrolled in "${courseTitle}".` });
        this.recentActivities.unshift({ icon: '🎉', text: `Enrolled in "${courseTitle}"`, time: 'Just now' });
        this.closeDetailsModal();
        this.loadEnrolledCourses();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Enrollment failed:', err);
        this.enrollingCourseId = null;
        void Swal.fire({ icon: 'error', title: 'Enrollment failed', text: err.error?.message || 'Failed to enroll in course.' });
      }
    });
  }

  updateProgress(item: any): void {
    if (item.progress >= 100) return;
    const newProgress = Math.min(100, (item.progress || 0) + 25);
    const enrollmentId = item.id;

    this.enrollmentService.updateProgress(enrollmentId, newProgress).subscribe({
      next: () => {
        item.progress = newProgress;
        const text = item.progress === 100
          ? `Congratulations! You completed "${item.courseTitle}"!`
          : `Progress updated to ${item.progress}%.`;
        void Swal.fire({ icon: 'success', title: item.progress === 100 ? 'Course completed' : 'Progress updated', text });
      },
      error: () => {
        item.progress = newProgress;
        void Swal.fire({
          icon: 'warning',
          title: 'Progress updated locally',
          text: `Progress updated locally to ${item.progress}%.`
        });
      }
    });
  }

  unenrollCourse(courseId: number): void {
    void Swal.fire({
      icon: 'warning',
      title: 'Unenroll from course?',
      text: 'Are you sure you want to unenroll from this course?',
      showCancelButton: true,
      confirmButtonText: 'Unenroll',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.enrolledCourses = this.enrolledCourses.filter(e => e.courseId !== courseId);
      void Swal.fire({ icon: 'success', title: 'Unenrolled', text: 'You have been unenrolled from the course.' });
      this.cdr.detectChanges();
    });
  }

  onStudentNameInput(event: any): void {
    let value = event.target.value.replace(/[0-9]/g, '');
    value = value.replace(/(^|\s)([a-z])/g, (match: string, p1: string, p2: string) => p1 + p2.toUpperCase());
    this.studentName = value;
  }

  onPhoneInput(event: any): void {
    let cleaned = event.target.value.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length > 0 && !/^[789]/.test(cleaned)) {
      cleaned = '';
    }
    this.studentPhone = cleaned;
  }

  onPhoneKeypress(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }
    if (this.studentPhone.length === 0 && !/^[789]$/.test(char)) {
      event.preventDefault();
    }
  }

  updateProfile(): void {
    if (!this.studentName || /\d/.test(this.studentName) || !/^[A-Z]/.test(this.studentName)) {
      void Swal.fire({ icon: 'error', title: 'Invalid name', text: 'Name must start with a capital letter and contain no numbers!' });
      return;
    }

    if (!/^[789]\d{9}$/.test(this.studentPhone)) {
      void Swal.fire({ icon: 'error', title: 'Invalid phone number', text: 'Phone number must be 10 digits and start with 7, 8, or 9!' });
      return;
    }

    if (this.newPassword || this.confirmNewPassword) {
      if (this.newPassword !== this.confirmNewPassword) {
        void Swal.fire({ icon: 'error', title: 'Password mismatch', text: 'New passwords do not match!' });
        return;
      }
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(this.newPassword)) {
        void Swal.fire({ icon: 'error', title: 'Invalid password', text: 'Password must be at least 8 characters long and include letters, numbers, and a symbol!' });
        return;
      }
    }

    this.isLoading = true;

    const profilePayload = {
      email: this.studentEmail,
      name: this.studentName,
      phone: this.studentPhone
    };

    this.authService.updateUserProfile(profilePayload).subscribe({
      next: () => {
        if (this.newPassword && this.currentPassword) {
          const passwordPayload = {
            email: this.studentEmail,
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
          };

          this.authService.updatePassword(passwordPayload).subscribe({
            next: () => this.finalizeSuccess('Profile & Password permanently updated in database! 🔒'),
            error: (err) => this.handleError(err.error?.message || 'Failed to update password in database.')
          });
        } else {
          this.finalizeSuccess('Profile settings successfully updated in database!');
        }
      },
      error: () => {
        setCookie('currentUserName', this.studentName);
        setCookie('currentUserPhone', this.studentPhone);
        this.finalizeSuccess('Profile updated locally (Database sync warning).');
      }
    });
  }

  private finalizeSuccess(successMsg: string): void {
    setCookie('currentUserName', this.studentName);
    setCookie('currentUserPhone', this.studentPhone);
    this.isLoading = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.cdr.detectChanges();
    void Swal.fire({ icon: 'success', title: 'Profile updated', text: successMsg });
  }

  private handleError(errorMsg: string): void {
    this.isLoading = false;
    void Swal.fire({ icon: 'error', title: 'Update failed', text: errorMsg });
  }
}