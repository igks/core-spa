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
import { environment } from "environments/environment";

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
    rootUrl: any = environment.rootUrl;
    imgURL: any;
    message: string;
    photoFile: any;
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
            });
        } else {
            this.form = this.formBuilder.group({
                firstname: ["", [Validators.required]],
                lastname: ["", [Validators.required]],
                address: ["", [Validators.required]],
                phoneNumber: ["", [phoneValidator]],
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
                this.imgURL = `${this.rootUrl}${data.user.photo}`;
            });

            this.form.setValue({
                firstname: this.user.firstname,
                lastname: this.user.lastname,
                address: this.user.address,
                phoneNumber: this.user.phoneNumber,
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
            (data) => {
                this.userService.uploadPhoto(data.id, this.photoFile).subscribe(
                    (data) => {
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
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    updateUser() {
        this.userService.editUser(this.id, this.form.value).subscribe(
            (data) => {
                this.userService.uploadPhoto(data.id, this.photoFile).subscribe(
                    (data) => {
                        this.alert.Success(
                            "Edit Successfully",
                            "Data has been edited, new photo has been added"
                        );
                        this.router.navigate(["pages/master/user"]);
                    },
                    (error) => {
                        this.alert.Error("", error);
                    }
                );
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    getPhoto(event: any) {
        let files = event.target.files;
        if (files.length === 0) {
            return;
        }

        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            this.imgURL = null;
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            this.imgURL = reader.result;
            this.message = null;
            this.photoFile = files[0];
        };
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
