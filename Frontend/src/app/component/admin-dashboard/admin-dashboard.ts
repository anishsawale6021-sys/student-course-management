import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { AuthService } from '../../services/auth.service';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie.util';
import Swal from 'sweetalert2';

export interface AdminCourse {
  id?: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  currentView: string = 'courses';

  adminName: string = 'Administrator';
  adminEmail: string = '';
  adminPhone: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  isLoading: boolean = false;
  searchTerm: string = '';

  courses: AdminCourse[] = [];
  enrolledStudents: any[] = [];

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  isDetailsModalOpen: boolean = false;
  selectedCourseDetails: AdminCourse | null = null;

  currentCourse: AdminCourse = { title: '', description: '', instructor: '', duration: '', level: 'Beginner' };
  announcementMessage: string = getCookie('portalAnnouncement') || 'System Update: New courses are now live in the catalog!';

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAdminProfile();
    this.loadCourses();
    this.loadEnrollments();
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

  updateAnnouncement(): void {
    setCookie('portalAnnouncement', this.announcementMessage);
    void Swal.fire({ icon: 'success', title: 'Announcement broadcasted', text: 'Your announcement was shared with all students.' });
  }

  loadAdminProfile(): void {
    this.adminName = getCookie('currentUserName') || 'Administrator';
    this.adminEmail = getCookie('currentUserEmail') || '';
    const savedPhone = getCookie('currentUserPhone') || '';
    this.adminPhone = /^\d+$/.test(savedPhone) ? savedPhone : '';
  }

  switchView(view: string): void {
    this.currentView = view;
    if (view === 'courses') this.loadCourses();
    else if (view === 'enrollments') this.loadEnrollments();
    this.cdr.detectChanges();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe({
      next: (data: any[]) => {
        this.courses = data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load courses:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data: any[]) => {
        const mapped = (data || []).map((e: any) => ({
          studentName: e.studentName || (e.user ? e.user.name : 'Student'),
          studentEmail: e.studentEmail || (e.user ? e.user.email : 'N/A'),
          courseTitle: e.courseTitle || (e.course ? e.course.title : 'Course'),
          date: e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : 'Recently',
          rawDate: e.enrollmentDate ? new Date(e.enrollmentDate).getTime() : 0
        }));

        mapped.sort((a: any, b: any) => b.rawDate - a.rawDate);

        this.enrolledStudents = mapped;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to fetch enrollments:', err)
    });
  }

  onAdminNameInput(event: any): void {
    let value = event.target.value.replace(/[0-9]/g, '');
    value = value.replace(/(^|\s)([a-z])/g, (match: string, p1: string, p2: string) => p1 + p2.toUpperCase());
    this.adminName = value;
  }

  onAdminPhoneInput(event: any): void {
    let cleaned = event.target.value.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length > 0 && !/^[789]/.test(cleaned)) {
      cleaned = '';
    }
    this.adminPhone = cleaned;
  }

  onPhoneKeypress(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }
    if (this.adminPhone.length === 0 && !/^[789]$/.test(char)) {
      event.preventDefault();
    }
  }

  onTitleInput(event: any): void {
    let value = event.target.value.replace(/[0-9]/g, '');
    value = value.replace(/(^|\s)([a-z])/g, (match: string, p1: string, p2: string) => p1 + p2.toUpperCase());
    this.currentCourse.title = value;
  }

  onDescriptionInput(event: any): void {
    let value = event.target.value.replace(/[0-9]/g, '');
    this.currentCourse.description = value;
  }

  onInstructorNameInput(event: any): void {
    let value = event.target.value.replace(/[0-9]/g, '');
    value = value.replace(/(^|\s)([a-z])/g, (match: string, p1: string, p2: string) => p1 + p2.toUpperCase());
    this.currentCourse.instructor = value;
  }

  getEnrolledStudentsForSelectedCourse(): any[] {
    if (!this.selectedCourseDetails) return [];
    return this.enrolledStudents.filter(
      e => e.courseTitle.toLowerCase().trim() === this.selectedCourseDetails?.title.toLowerCase().trim()
    );
  }

  updateProfile(): void {
    if (!this.adminName || /\d/.test(this.adminName) || !/^[A-Z]/.test(this.adminName)) {
      void Swal.fire({ icon: 'error', title: 'Invalid name', text: 'Name must start with a capital letter and contain no numbers!' });
      return;
    }

    if (!/^[789]\d{9}$/.test(this.adminPhone)) {
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
      email: this.adminEmail,
      name: this.adminName,
      phone: this.adminPhone
    };

    this.authService.updateUserProfile(profilePayload).subscribe({
      next: () => {
        if (this.newPassword && this.currentPassword) {
          const passwordPayload = {
            email: this.adminEmail,
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
          };

          this.authService.updatePassword(passwordPayload).subscribe({
            next: () => this.finalizeSuccess('Admin Profile & Password updated securely! 🔒'),
            error: (err: any) => this.handleError(err.error?.message || 'Failed to update password.')
          });
        } else {
          this.finalizeSuccess('Admin profile settings updated successfully!');
        }
      },
      error: () => {
        setCookie('currentUserName', this.adminName);
        setCookie('currentUserPhone', this.adminPhone);
        this.finalizeSuccess('Profile updated locally.');
      }
    });
  }

  private finalizeSuccess(successMsg: string): void {
    setCookie('currentUserName', this.adminName);
    setCookie('currentUserPhone', this.adminPhone);
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

  get filteredCourses() {
    if (!this.searchTerm) return this.courses;
    return this.courses.filter(c =>
      c.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentCourse = { title: '', description: '', instructor: '', duration: '', level: 'Beginner' };
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  openEditModal(course: AdminCourse, event?: Event): void {
    if (event) event.stopPropagation();
    this.isEditMode = true;
    this.currentCourse = { ...course };
    this.isModalOpen = true;
    this.isDetailsModalOpen = false;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  openCourseDetails(course: AdminCourse): void {
    this.selectedCourseDetails = course;
    this.isDetailsModalOpen = true;
    this.cdr.detectChanges();
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedCourseDetails = null;
    this.cdr.detectChanges();
  }

  saveCourse(): void {
    if (!this.currentCourse.title || !this.currentCourse.instructor || !this.currentCourse.duration) {
      void Swal.fire({ icon: 'error', title: 'Missing information', text: 'Please fill out all required course fields.' });
      return;
    }

    if (/\d/.test(this.currentCourse.title)) {
      void Swal.fire({ icon: 'error', title: 'Invalid course title', text: 'Course title cannot contain numbers!' });
      return;
    }
    if (/\d/.test(this.currentCourse.instructor)) {
      void Swal.fire({ icon: 'error', title: 'Invalid instructor name', text: 'Instructor name cannot contain numbers!' });
      return;
    }
    if (/\d/.test(this.currentCourse.description)) {
      void Swal.fire({ icon: 'error', title: 'Invalid description', text: 'Description cannot contain numbers!' });
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.currentCourse.id) {
      this.courseService.updateCourse(this.currentCourse.id, this.currentCourse).subscribe({
        next: () => {
          this.isLoading = false;
          void Swal.fire({ icon: 'success', title: 'Course updated', text: 'The course was updated successfully.' });
          this.closeModal();
          this.loadCourses();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          this.isLoading = false;
          void Swal.fire({ icon: 'error', title: 'Update failed', text: err.error?.message || 'Failed to update course.' });
          this.cdr.detectChanges();
        }
      });
    } else {
      this.courseService.createCourse(this.currentCourse).subscribe({
        next: () => {
          this.isLoading = false;
          void Swal.fire({ icon: 'success', title: 'Course added', text: 'The course was added successfully.' });
          const autoNotice = `🚀 New Course Added: "${this.currentCourse.title}" is now available!`;
          setCookie('portalAnnouncement', autoNotice);
          this.announcementMessage = autoNotice;
          this.closeModal();
          this.loadCourses();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Creation failed:', err);
          this.isLoading = false;
          void Swal.fire({ icon: 'error', title: 'Creation failed', text: err.error?.message || 'Failed to create course.' });
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteCourse(id?: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (!id) return;
    void Swal.fire({
      icon: 'warning',
      title: 'Delete course?',
      text: 'Are you sure you want to delete this course?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          void Swal.fire({ icon: 'success', title: 'Course deleted', text: 'The course was deleted successfully.' });
          this.closeDetailsModal();
          this.loadCourses();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Deletion failed:', err);
          void Swal.fire({
            icon: 'error',
            title: 'Deletion failed',
            text: err.error?.message || 'Cannot delete course: Students are currently enrolled in it!'
          });
          this.closeDetailsModal();
          this.cdr.detectChanges();
        }
      });
    });
  }
}