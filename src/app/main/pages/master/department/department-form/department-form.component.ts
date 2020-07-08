import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Department } from "app/models/department.model";
import { Employee } from "app/models/employee.model";
import { DepartmentService } from "app/services/department.service";
import { EmployeeService } from "app/services/employee.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Pagination, PaginatedResult } from "app/models/pagination.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: "app-department-form",
    templateUrl: "./department-form.component.html",
    styleUrls: ["./department-form.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class DepartmentFormComponent implements OnInit {
    displayedColumns: string[] = ["code", "name"];

    id = +this.route.snapshot.params.id;
    department: Department;
    departmentList: Department[];
    employeeList: Employee[];
    subDepartments: Department[];
    isUpdate: boolean = false;
    isStillLoading: boolean = true;

    form: FormGroup;

    constructor(
        private departmentService: DepartmentService,
        private employeeService: EmployeeService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            code: ["", [Validators.required]],
            name: ["", [Validators.required]],
            parentId: [null],
            managerId: [null],
            assistantId: [null],
        });
        this.loadDropDownData();
        this.checkUpdate();
    }

    checkUpdate() {
        if (this.id) {
            this.isStillLoading = true;
            this.isUpdate = true;
            this.route.data.subscribe((data) => {
                this.department = data.department;
            });

            this.form.setValue({
                code: this.department.code,
                name: this.department.name,
                parentId: this.department.parentId,
                managerId: this.department.managerId,
                assistantId: this.department.assistantId,
            });

            this.departmentService
                .getSubDepartment(this.id)
                .subscribe((data) => {
                    this.subDepartments = data;
                    this.isStillLoading = false;
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

    loadDropDownData() {
        this.isStillLoading = true;
        this.departmentService.getAllDepartment().subscribe((data) => {
            this.departmentList = data;
        });
        this.employeeService.getAllEmployee().subscribe((data) => {
            this.employeeList = data;
        });
        this.isStillLoading = false;
    }
}
