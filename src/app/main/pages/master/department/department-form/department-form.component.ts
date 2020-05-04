import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Department } from "app/models/department.model";
import { DepartmentService } from "app/services/department.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-department-form",
    templateUrl: "./department-form.component.html",
    styleUrls: ["./department-form.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class DepartmentFormComponent implements OnInit {
    id = +this.route.snapshot.params.id;
    department: Department;
    isUpdate: boolean = false;

    form: FormGroup;

    constructor(
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            code: ["", [Validators.required]],
            name: ["", [Validators.required]],
        });

        this.checkUpdate();
    }

    checkUpdate() {
        if (this.id) {
            this.isUpdate = true;
            this.route.data.subscribe((data) => {
                this.department = data.department;
            });

            this.form.setValue({
                code: this.department.code,
                name: this.department.name,
            });
        }
    }

    submit() {
        if (!this.isUpdate) {
            this.addNewDepartment();
        } else {
            this.updateDepartment();
        }
    }

    addNewDepartment() {
        this.form.value.isUpdate = false;
        this.departmentService.addDepartment(this.form.value).subscribe(
            () => {
                this.alert.Success(
                    "Add Successfully",
                    "Data has been added to the record"
                );
                this.router.navigate(["pages/master/department"]);
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    updateDepartment() {
        this.form.value.isUpdate = true;
        this.departmentService
            .editDepartment(this.id, this.form.value)
            .subscribe(
                () => {
                    this.alert.Success(
                        "Edit Successfully",
                        "Data has been edited"
                    );
                    this.router.navigate(["pages/master/department"]);
                },
                (error) => {
                    this.alert.Error("", error);
                }
            );
    }
}
