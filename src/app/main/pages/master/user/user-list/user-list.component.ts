import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { User } from "app/models/user.model";
import { Pagination, PaginatedResult } from "app/models/pagination.model";
import { UserService } from "app/services/user.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-user-list",
    templateUrl: "./user-list.component.html",
    styleUrls: ["./user-list.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserListComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    displayedColumns: string[] = ["name", "email", "buttons"];

    users: User[];
    pagination: Pagination;
    userParams: any = {};
    model: any = {};

    isFiltered: boolean = false;
    showFilterForm: boolean = false;

    form: FormGroup;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstname: [""],
        });

        this.route.data.subscribe((data) => {
            this.users = data.user.result;
            this.pagination = data.user.pagination;
        });
    }

    loadUser() {
        this.userService
            .getUsers(
                this.pagination.currentPage,
                this.pagination.pageSize,
                this.userParams
            )
            .subscribe(
                (res: PaginatedResult<User[]>) => {
                    this.users = res.result;
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
        this.loadUser();
    }

    sortChange(event: any) {
        this.pagination.currentPage = 1;
        this.userParams.OrderBy = event.active;
        this.userParams.isDescending =
            event.direction === "desc" ? true : false;
        this.loadUser();
    }

    setShowFilterForm() {
        this.showFilterForm = true;
    }

    addFilter() {
        this.showFilterForm = false;
        if (this.form.value.code != null && this.form.value.code != "") {
            this.isFiltered = true;
            this.pagination.currentPage = 1;
            this.userParams.firstname = this.form.value.firstname;
            this.loadUser();
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
        this.userParams.firstname = null;
        this.form.reset();
        this.loadUser();
    }

    deleteUser(id: number) {
        const confirm = this.alert.Confirm();
        confirm.afterClosed().subscribe((result) => {
            if (result === true) {
                this.userService.deleteUser(id).subscribe(
                    () => {
                        this.alert.Info("", "The data has been deleted");
                        this.loadUser();
                    },
                    (error) => {
                        this.alert.Error("", error);
                    }
                );
            }
        });
    }
}
