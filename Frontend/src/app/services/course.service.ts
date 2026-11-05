import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private baseUrl = 'https://student-course-management-d0ud.onrender.com/api';

    constructor(private http: HttpClient) { }

    // Get all courses (Student/Public view)
    getCourses(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/courses`);
    }

    // Get course details by ID
    getCourseById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/courses/${id}`);
    }

    // Admin: Create a new course
    createCourse(courseData: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/admin/courses`, courseData);
    }

    // Admin: Update an existing course
    updateCourse(id: number, courseData: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/admin/courses/${id}`, courseData);
    }

    // Admin: Delete a course
    deleteCourse(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/admin/courses/${id}`);
    }
}