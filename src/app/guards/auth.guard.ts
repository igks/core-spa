import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import { AlertService } from "app/services/alert.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private alert: AlertService
    ) {}

    canActivate(): boolean {
        return true;

        if (this.authService.isAuthenticated()) {
            return true;
        }

        this.alert.Error(
            "You are not authenticated",
            "Please login to the application"
        );
        this.router.navigate(["/auth/login"]);
        return false;
    }
}
