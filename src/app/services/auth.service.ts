import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    baseUrl = environment.apiUrl;
    jwtHelper = new JwtHelperService();
    decodedToken: any;
    users: any;

    constructor(private http: HttpClient) {}

    login(model: any) {
        return this.http.post(this.baseUrl + "auth/login/", model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    localStorage.setItem("token", user.token);
                    localStorage.setItem("username", user.userData.firstname);
                }
            })
        );
    }

    register(model: any) {
        return this.http.post(this.baseUrl + "auth/register/", model).pipe(
            map((response: any) => {
                const user = response;
            })
        );
    }

    isAuthenticated() {
        const token = localStorage.getItem("token") || undefined;
        return !this.jwtHelper.isTokenExpired(token);
    }
}
