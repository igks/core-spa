import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { Department } from "app/models/department.model";
import { Pagination, PaginatedResult } from "app/models/pagination.model";
import { DepartmentService } from "app/services/department.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-department-list",
    templateUrl: "./department-list.component.html",
    styleUrls: ["./department-list.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class DepartmentListComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    displayedColumns: string[] = ["code", "name", "buttons"];

    departments: Department[];
    pagination: Pagination;
    departmentParams: any = {};
    model: any = {};

    isFiltered: boolean = false;
    showFilterForm: boolean = false;

    form: FormGroup;

    constructor(
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            code: [""],
            name: [""],
        });

        this.route.data.subscribe((data) => {
            this.departments = data.department.result;
            this.pagination = data.department.pagination;
        });
    }

    loadDepartment() {
        this.departmentService
            .getDepartments(
                this.pagination.currentPage,
                this.pagination.pageSize,
                this.departmentParams
            )
            .subscribe(
                (res: PaginatedResult<Department[]>) => {
                    this.departments = res.result;
                    this.pagination = res.pagination;
                },
                (error) => {
                    this.alert.Error("", error.statusText);
                }
            );
    }

    pageEvents(event: any) {
        this.pagination.currentPage = event.pageIndex + 1;
        this.pagination.pageSize = event.pageSize;
        this.loadDepartment();
    }

    sortChange(event: any) {
        this.pagination.currentPage = 1;
        this.departmentParams.OrderBy = event.active;
        this.departmentParams.isDescending =
            event.direction === "desc" ? true : false;
        this.loadDepartment();
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
            this.departmentParams.code = this.form.value.code;
            this.departmentParams.name = this.form.value.name;
            this.loadDepartment();
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
        this.departmentParams.code = null;
        this.departmentParams.name = null;
        this.form.reset();
        this.loadDepartment();
    }

    deleteDepartment(id: number) {
        const confirm = this.alert.Confirm();
        confirm.afterClosed().subscribe((result) => {
            if (result === true) {
                this.departmentService.deleteDepartment(id).subscribe(
                    () => {
                        this.alert.Info("", "The data has been deleted");
                        this.loadDepartment();
                    },
                    (error) => {
                        this.alert.Error("", error);
                    }
                );
            }
        });
    }
}
