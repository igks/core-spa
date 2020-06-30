import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Employee } from "app/models/employee.model";
import { EmployeeService } from "app/services/employee.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-employee-form",
    templateUrl: "./employee-form.component.html",
    styleUrls: ["./employee-form.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class EmployeeFormComponent implements OnInit {
    id = +this.route.snapshot.params.id;
    employee: Employee;
    isUpdate: boolean = false;

    form: FormGroup;

    constructor(
        private employeeService: EmployeeService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstname: ["", [Validators.required]],
            lastname: ["", [Validators.required]],
        });

        this.checkUpdate();
    }

    checkUpdate() {
        if (this.id) {
            this.isUpdate = true;
            this.route.data.subscribe((data) => {
                this.employee = data.employee;
            });

            this.form.setValue({
                firstname: this.employee.firstname,
                lastname: this.employee.lastname,
            });
        }
    }

    submit() {
        if (!this.isUpdate) {
            this.addNewEmployee();
        } else {
            this.updateEmployee();
        }
    }

    addNewEmployee() {
        this.form.value.isUpdate = false;
        this.employeeService.addEmployee(this.form.value).subscribe(
            () => {
                this.alert.Success(
                    "Add Successfully",
                    "Data has been added to the record"
                );
                this.router.navigate(["pages/master/employee"]);
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    updateEmployee() {
        this.form.value.isUpdate = true;
        this.employeeService
            .editEmployee(this.id, this.form.value)
            .subscribe(
                () => {
                    this.alert.Success(
                        "Edit Successfully",
                        "Data has been edited"
                    );
                    this.router.navigate(["pages/master/employee"]);
                },
                (error) => {
                    this.alert.Error("", error);
                }
            );
    }
}
