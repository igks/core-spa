import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import { AlertService } from "app/services/alert.service";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    model: any = {};

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private alert: AlertService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required],
        });
    }

    //Own function
    login() {
        this.authService.login(this.loginForm.value).subscribe(
            (next) => {
                this.loginSuccess();
            },
            (error) => {
                this.loginFailed(error);
            }
        );
    }

    signInWithGoogle() {
        this.authService.signInWithGoogle()
        .then((user) => {
           this.authService.socialLogin({ email: user.email }).subscribe(
                (next) => {
                    this.loginSuccess();
                },
                (error) => {
                    this.loginFailed(error);
                }
            );
        })
        .catch(error => {return null});
    }

    signInWithFacebook() {
        this.authService.signInWithFacebook()
        .then((user) => {
            this.authService.socialLogin({ email: user.email }).subscribe(
                (next) => {
                    this.loginSuccess();
                },
                (error) => {
                    this.loginFailed(error);
                }
            );
        })
        .catch(error => {return null});
    }

    loginSuccess() {
        this.alert.Success("Login Success", "");
        this.router.navigate(["/dashboard"]);
    }

    loginFailed(error) {
        if (error == "Unauthorized") {
            this.alert.Error(
                error + "!",
                "Seem you don't have an account! Please check your credential or click create account to create new account."
            );
        } else {
            this.alert.Error(
                "Connection refused!",
                "Can not reach the API, please check your internet connection!"
            );
        }
    }
}
