import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment";
import { SocialAuthService } from "angularx-social-login";
import {
    FacebookLoginProvider,
    GoogleLoginProvider,
} from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    baseUrl = environment.apiUrl;
    jwtHelper = new JwtHelperService();
    decodedToken: any;
    users: any;
    socialUser: SocialUser;

    constructor(
        private http: HttpClient,
        private socialAuthService: SocialAuthService
    ) {}

    login(model: any) {
        return this.http.post(this.baseUrl + "auth/login/", model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    localStorage.setItem("token", user.token);
                    localStorage.setItem("username", user.userData.firstname);
                    localStorage.setItem("userId", user.userData.id);
                    localStorage.setItem("resource", "int");
                }
            })
        );
    }

    socialLogin(data: any) {
        return this.http.post(this.baseUrl + "auth/social-login/", data).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    localStorage.setItem("token", user.token);
                    localStorage.setItem("username", user.userData.firstname);
                    localStorage.setItem("userId", user.userData.id);
                    localStorage.setItem("resource", "ext");
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

    signInWithGoogle() {
        return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signInWithFacebook() {
        return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    signOut(): void {
        if (localStorage.getItem("status") === "ext") {
            this.socialAuthService.signOut();
        }
        localStorage.clear();
    }
}
