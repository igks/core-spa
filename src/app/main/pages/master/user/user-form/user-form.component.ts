import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "app/models/user.model";
import { UserService } from "app/services/user.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import {
    FormBuilder,
    FormGroup,
    Validators,
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
} from "@angular/forms";

@Component({
    selector: "app-user-form",
    templateUrl: "./user-form.component.html",
    styleUrls: ["./user-form.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserFormComponent implements OnInit {
    id = +this.route.snapshot.params.id;
    user: User;
    isUpdate: boolean = false;
    form: FormGroup;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.formInit();
        this.checkUpdate();
    }

    formInit() {
        if (this.id) {
            this.form = this.formBuilder.group({
                firstname: ["", [Validators.required]],
                lastname: ["", [Validators.required]],
                address: ["", [Validators.required]],
                phoneNumber: ["", [phoneValidator]],
                photo: [""],
            });
        } else {
            this.form = this.formBuilder.group({
                firstname: ["", [Validators.required]],
                lastname: ["", [Validators.required]],
                address: ["", [Validators.required]],
                phoneNumber: ["", [phoneValidator]],
                photo: [""],
                email: ["", [Validators.required]],
                password: ["", [Validators.required]],
            });
        }
    }

    checkUpdate() {
        if (this.id) {
            this.isUpdate = true;
            this.route.data.subscribe((data) => {
                this.user = data.user;
            });

            this.form.setValue({
                firstname: this.user.firstname,
                lastname: this.user.lastname,
                address: this.user.address,
                phoneNumber: this.user.phoneNumber,
                photo: this.user.photo,
            });
        }
    }

    submit() {
        if (!this.isUpdate) {
            this.addNewUser();
        } else {
            this.updateUser();
        }
    }

    addNewUser() {
        this.userService.addUser(this.form.value).subscribe(
            () => {
                this.alert.Success(
                    "Add Successfully",
                    "Data has been added to the record"
                );
                this.router.navigate(["pages/master/user"]);
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    updateUser() {
        this.userService.editUser(this.id, this.form.value).subscribe(
            () => {
                this.alert.Success("Edit Successfully", "Data has been edited");
                this.router.navigate(["pages/master/user"]);
            },
            (error) => {
                this.alert.Error("", error);
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
export const phoneValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }

    const phone = control.parent.get("phoneNumber");

    if (!phone) {
        return null;
    }

    if (phone.value === "") {
        return null;
    }

    if (phone.value.match(/^[0-9]+$/)) {
        return null;
    }

    return { phoneNumberInvalid: true };
};
