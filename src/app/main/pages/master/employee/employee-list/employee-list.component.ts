import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { Employee } from "app/models/employee.model";
import { Pagination, PaginatedResult } from "app/models/pagination.model";
import { EmployeeService } from "app/services/employee.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-employee-list",
    templateUrl: "./employee-list.component.html",
    styleUrls: ["./employee-list.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EmployeeListComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    displayedColumns: string[] = ["firstname", "lastname", "buttons"];

    employees: Employee[];
    pagination: Pagination;
    empolyeeParams: any = {};
    model: any = {};

    isFiltered: boolean = false;
    showFilterForm: boolean = false;

    form: FormGroup;

    constructor(
        private employeeService: EmployeeService,
        private route: ActivatedRoute,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        // this.form = this.formBuilder.group({
        //     firstname: [""],
        //     lastname: [""]
        // });

        this.route.data.subscribe(data => {
            this.employees = data.employee.result;
            this.pagination = data.employee.pagination;
        });
    }

    loadEmployee() {
        this.employeeService
            .getEmployees(
                this.pagination.currentPage,
                this.pagination.pageSize,
                this.empolyeeParams
            )
            .subscribe(
                (res: PaginatedResult<Employee[]>) => {
                    this.employees = res.result;
                    this.pagination = res.pagination;
                },
                error => {
                    this.alert.Error("", error.statusText);
                }
            );
    }

    pageEvents(event: any) {
        this.pagination.currentPage = event.pageIndex + 1;
        this.pagination.pageSize = event.pageSize;
        this.loadEmployee();
    }

    sortChange(event: any) {
        this.pagination.currentPage = 1;
        this.empolyeeParams.OrderBy = event.active;
        this.empolyeeParams.isDescending =
            event.direction === "desc" ? true : false;
        this.loadEmployee();
    }

    setShowFilterForm() {
        this.showFilterForm = true;
    }

    addFilter() {
        this.showFilterForm = false;
        if (
            (this.form.value.code != null && this.form.value.code != "") ||
            (this.form.value.name != null && this.form.value.name != "")
        ) {
            this.isFiltered = true;
            this.pagination.currentPage = 1;
            this.empolyeeParams.firstname = this.form.value.firstname;
            this.empolyeeParams.lastname = this.form.value.lastname;
            this.loadEmployee();
        }
    }

    cancelFilter() {
        this.form.reset();
        this.isFiltered = false;
        this.showFilterForm = false;
    }

    clearFilter() {
        this.isFiltered = false;
        this.pagination.currentPage = 1;
        this.empolyeeParams.firstname = null;
        this.empolyeeParams.lastname = null;
        this.form.reset();
        this.loadEmployee();
    }

    deleteEmployee(id: number) {
        const confirm = this.alert.Confirm();
        confirm.afterClosed().subscribe(result => {
            if (result === true) {
                this.employeeService.deleteEmployee(id).subscribe(
                    () => {
                        this.alert.Info("", "The data has been deleted");
                        this.loadEmployee();
                    },
                    error => {
                        this.alert.Error("", error);
                    }
                );
            }
        });
    }
}
