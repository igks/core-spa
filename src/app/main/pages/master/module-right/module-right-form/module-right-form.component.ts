import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ModuleRight } from "app/models/module-right.model";
import { ModuleRightService } from "app/services/module-right.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Pagination, PaginatedResult } from "app/models/pagination.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: "app-module-right-form",
    templateUrl: "./module-right-form.component.html",
    styleUrls: ["./module-right-form.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ModuleRightFormComponent implements OnInit {
    displayedColumns: string[] = ["code", "name"];

    id = +this.route.snapshot.params.id;
    moduleRight: ModuleRight;
    isUpdate: boolean = false;

    form: FormGroup;

    constructor(
        private moduleService: ModuleRightService,
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
                this.moduleRight = data.moduleright;
            });

            this.form.setValue({
                code: this.moduleRight.code,
                name: this.moduleRight.name
            });
        }
    }

    submit() {
        if (!this.isUpdate) {
            this.addNewModule();
        } else {
            this.updateModule();
        }
    }

    addNewModule() {
        this.form.value.isUpdate = false;
        this.moduleService.addModule(this.form.value).subscribe(
            () => {
                this.alert.Success(
                    "Add Successfully",
                    "Data has been added to the record"
                );
                this.router.navigate(["pages/master/moduleright"]);
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    updateModule() {
        this.form.value.isUpdate = true;
        this.moduleService
            .editModule(this.id, this.form.value)
            .subscribe(
                () => {
                    this.alert.Success(
                        "Edit Successfully",
                        "Data has been edited"
                    );
                    this.router.navigate(["pages/master/moduleright"]);
                },
                (error) => {
                    this.alert.Error("", error);
                }
            );
    }
}
