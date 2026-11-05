import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getCookie } from '../utils/cookie.util';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {
    private apiUrl = 'http://localhost:8081/api';

    constructor(private http: HttpClient) { }

    getEnrollments(email?: string): Observable<any[]> {
        let params = new HttpParams();
        if (email) {
            params = params.set('email', email);
        }
        return this.http.get<any[]>(`${this.apiUrl}/enrollments`, { params });
    }

    getAllEnrollments(): Observable<any[]> {
        return this.getEnrollments();
    }

    enrollCourse(course: any): Observable<any> {
        const studentEmail = getCookie('currentUserEmail') || 'radha@gmail.com';
        const studentName = getCookie('currentUserName') || 'Radha';

        const payload = {
            courseTitle: course.title || course.courseTitle,
            instructor: course.instructor,
            studentName: studentName,
            studentEmail: studentEmail
        };

        return this.http.post(`${this.apiUrl}/courses/${course.id}/enroll`, payload);
    }

    updateProgress(enrollmentId: number, progress: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/enrollments/${enrollmentId}/progress`, { progress });
    }
}