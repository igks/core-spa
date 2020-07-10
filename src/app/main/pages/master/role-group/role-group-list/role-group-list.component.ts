import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { RoleGroup } from "app/models/role-group.model";
import { Pagination, PaginatedResult } from "app/models/pagination.model";
import { RoleGroupService } from "app/services/role-group.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-role-group-list",
    templateUrl: "./role-group-list.component.html",
    styleUrls: ["./role-group-list.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class RoleGroupListComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    displayedColumns: string[] = ["code", "name", "buttons"];

    roleGroups: RoleGroup[];
    pagination: Pagination;
    roleGroupParams: any = {};
    model: any = {};

    isFiltered: boolean = false;
    showFilterForm: boolean = false;

    form: FormGroup;

    constructor(
        private groupService: RoleGroupService,
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
            this.roleGroups = data.roleGroup.result;
            this.pagination = data.roleGroup.pagination;
        });
    }

    loadGroup() {
        this.groupService
            .getRoleGroups(
                this.pagination.currentPage,
                this.pagination.pageSize,
                this.roleGroupParams
            )
            .subscribe(
                (res: PaginatedResult<RoleGroup[]>) => {
                    this.roleGroups = res.result;
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
        this.loadGroup();
    }

    sortChange(event: any) {
        this.pagination.currentPage = 1;
        this.roleGroupParams.OrderBy = event.active;
        this.roleGroupParams.isDescending =
            event.direction === "desc" ? true : false;
        this.loadGroup();
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
            this.roleGroupParams.code = this.form.value.code;
            this.roleGroupParams.name = this.form.value.name;
            this.loadGroup();
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
        this.roleGroupParams.code = null;
        this.roleGroupParams.name = null;
        this.form.reset();
        this.loadGroup();
    }

    deleteDepartment(id: number) {
        const confirm = this.alert.Confirm();
        confirm.afterClosed().subscribe((result) => {
            if (result === true) {
                this.groupService.deleteRoleGroup(id).subscribe(
                    () => {
                        this.alert.Info("", "The data has been deleted");
                        this.loadGroup();
                    },
                    (error) => {
                        this.alert.Error("", error);
                    }
                );
            }
        });
    }
}
