import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8081/api/auth';
    private userApiUrl = 'http://localhost:8081/api/users';

    constructor(private http: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials);
    }

    updateUserProfile(userData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/update-profile`, userData);
    }

    updatePassword(passwordData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/update-password`, passwordData);
    }
}