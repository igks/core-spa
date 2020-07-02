import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators";
import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router";
import { AlertService } from "app/services/alert.service";

@Component({
    selector: "register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.registerForm = this._formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required],
            passwordConfirm: [
                "",
                [Validators.required, confirmPasswordValidator],
            ],
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm
            .get("password")
            .valueChanges.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm
                    .get("passwordConfirm")
                    .updateValueAndValidity();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    register() {
        console.log(this.registerForm.value);
        return;
        this.authService.register(this.registerForm.value).subscribe(
            (next) => {
                this.alert.Success(
                    "Register Success",
                    "New account has been created, please login to your account."
                );
                this.router.navigate(["/pages/auth/login"]);
            },
            (error) => {
                this.alert.Error("Register Failed", error);
            }
        );
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get("password");
    const passwordConfirm = control.parent.get("passwordConfirm");

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === "") {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
