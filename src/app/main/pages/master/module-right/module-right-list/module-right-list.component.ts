import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { ModuleRight } from "app/models/module-right.model";
import { Pagination, PaginatedResult } from "app/models/pagination.model";
import { ModuleRightService } from "app/services/module-right.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-module-right-list",
    templateUrl: "./module-right-list.component.html",
    styleUrls: ["./module-right-list.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ModuleRightListComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    displayedColumns: string[] = ["code", "name", "buttons"];

    moduleRights: ModuleRight[];
    pagination: Pagination;
    moduleParams: any = {};
    model: any = {};

    isFiltered: boolean = false;
    showFilterForm: boolean = false;

    form: FormGroup;

    constructor(
        private moduleService: ModuleRightService,
        private route: ActivatedRoute,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            code: [""],
            name: [""]
        });

        this.route.data.subscribe(data => {
            this.moduleRights = data.moduleright.result;
            this.pagination = data.moduleright.pagination;
        });
    }

    loadModuleRight() {
        this.moduleService
            .getModules(
                this.pagination.currentPage,
                this.pagination.pageSize,
                this.moduleParams
            )
            .subscribe(
                (res: PaginatedResult<ModuleRight[]>) => {
                    this.moduleRights = res.result;
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
        this.loadModuleRight();
    }

    sortChange(event: any) {
        this.pagination.currentPage = 1;
        this.moduleParams.OrderBy = event.active;
        this.moduleParams.isDescending =
            event.direction === "desc" ? true : false;
        this.loadModuleRight();
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
            this.moduleParams.code = this.form.value.code;
            this.moduleParams.name = this.form.value.name;
            this.loadModuleRight();
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
        this.moduleParams.code = null;
        this.moduleParams.name = null;
        this.form.reset();
        this.loadModuleRight();
    }

    deleteModuleRight(id: number) {
        const confirm = this.alert.Confirm();
        confirm.afterClosed().subscribe(result => {
            if (result === true) {
                this.moduleService.deleteModule(id).subscribe(
                    () => {
                        this.alert.Info("", "The data has been deleted");
                        this.loadModuleRight();
                    },
                    error => {
                        this.alert.Error("", error);
                    }
                );
            }
        });
    }
}
