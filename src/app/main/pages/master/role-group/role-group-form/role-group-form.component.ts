import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { RoleGroup } from "app/models/role-group.model";
import { ModuleRight } from "app/models/module-right.model";
import { RoleGroupService } from "app/services/role-group.service";
import { ModuleRightService } from "app/services/module-right.service";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-role-group-form",
    templateUrl: "./role-group-form.component.html",
    styleUrls: ["./role-group-form.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class RoleGroupFormComponent implements OnInit {
    constructor(
        private groupService: RoleGroupService,
        private moduleService: ModuleRightService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertService,
        private formBuilder: FormBuilder
    ) {}
    id = +this.route.snapshot.params.id;

    roleGroup: RoleGroup;
    moduleRights: ModuleRight[];
    modulesRightId: number[] = [];
    selectedReadModules: any = [];
    selectedWriteModules: any = [];
    validReadModules: any = [];
    validWriteModules: any = [];
    isUpdate: boolean = false;
    isLoading: boolean = false;

    form: FormGroup;

    displayedColumns: string[] = ["name", "read", "write"];
    readAccess: {};
    writeAccess: {};

    ngOnInit() {
        this.form = this.formBuilder.group({
            code: ["", [Validators.required]],
            name: ["", [Validators.required]],
            modulesReadId: [[]],
            modulesWriteId: [[]],
        });
        this.checkUpdate();
        this.loadModuleRight();
    }

    checkUpdate() {
        if (this.id) {
            this.isUpdate = true;
            this.route.data.subscribe((data) => {
                this.roleGroup = data.roleGroup;
                this.selectedReadModules = data.roleGroup.modulesReadId;
                this.selectedWriteModules = data.roleGroup.modulesWriteId;

                this.form.setValue({
                    code: this.roleGroup.code,
                    name: this.roleGroup.name,
                    modulesReadId: [],
                    modulesWriteId: [],
                });
            });
        }
    }

    loadModuleRight() {
        this.isLoading = true;
        this.moduleService.getAllModules().subscribe((data) => {
            this.moduleRights = data;
            this.readAccess = {};
            this.writeAccess = {};
            data.map((module) => {
                this.modulesRightId.push(module.id);
                this.selectedReadModules.includes(module.id)
                    ? (this.readAccess[module.id] = true)
                    : (this.readAccess[module.id] = false);
                this.selectedWriteModules.includes(module.id)
                    ? (this.writeAccess[module.id] = true)
                    : (this.writeAccess[module.id] = false);
            });
            this.isLoading = false;
        });
    }

    // validate selected module, remove module id from selected module list if actual module was remove in database
    validateModule() {
        this.validReadModules.length = 0;
        this.validWriteModules.length = 0;

        this.selectedReadModules.map((id) => {
            if (this.modulesRightId.includes(id)) {
                this.validReadModules.push(id);
            }
        });

        this.selectedWriteModules.map((id) => {
            if (this.modulesRightId.includes(id)) {
                this.validWriteModules.push(id);
            }
        });

        this.form.patchValue({
            modulesReadId:
                this.validReadModules.length > 0 ? this.validReadModules : null,
        });

        this.form.patchValue({
            modulesWriteId:
                this.validWriteModules.length > 0
                    ? this.validWriteModules
                    : null,
        });
    }

    addNewGroup() {
        this.form.value.isUpdate = false;
        this.groupService.addRoleGroup(this.form.value).subscribe(
            () => {
                this.alert.Success(
                    "Add Successfully",
                    "Data has been added to the record"
                );
                this.router.navigate(["pages/master/rolegroup"]);
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    updateGroup() {
        this.form.value.isUpdate = true;
        this.groupService.editRoleGroup(this.id, this.form.value).subscribe(
            () => {
                this.alert.Success("Edit Successfully", "Data has been edited");
                this.router.navigate(["pages/master/rolegroup"]);
            },
            (error) => {
                this.alert.Error("", error);
            }
        );
    }

    submit() {
        this.validateModule();

        if (!this.isUpdate) {
            this.addNewGroup();
        } else {
            this.updateGroup();
        }
    }

    onReadAccessChange(moduleId): void {
        const indexChange = this.selectedReadModules.indexOf(moduleId);
        if (indexChange !== -1) {
            this.selectedReadModules.splice(indexChange, 1);
        } else {
            this.selectedReadModules.push(moduleId);
        }
    }

    onWriteAccessChange(moduleId): void {
        const indexChange = this.selectedWriteModules.indexOf(moduleId);
        if (indexChange !== -1) {
            this.selectedWriteModules.splice(indexChange, 1);
        } else {
            this.selectedWriteModules.push(moduleId);
        }
    }

    selectAllReadAccess() {
        this.moduleRights.map((module) => {
            this.readAccess[module.id] = true;
            if (!this.selectedReadModules.includes(module.id)) {
                this.selectedReadModules.push(module.id);
            }
        });
    }

    clearAllReadAccess() {
        this.moduleRights.map((module) => {
            this.readAccess[module.id] = false;
            this.selectedReadModules.length = 0;
            this.form.patchValue({
                modulesReadId: null,
            });
        });
    }

    selectAllWriteAccess() {
        this.moduleRights.map((module) => {
            this.writeAccess[module.id] = true;
            if (!this.selectedWriteModules.includes(module.id)) {
                this.selectedWriteModules.push(module.id);
            }
        });
    }

    clearAllWriteAccess() {
        this.moduleRights.map((module) => {
            this.writeAccess[module.id] = false;
            this.selectedWriteModules.length = 0;
            this.form.patchValue({
                modulesWriteId: null,
            });
        });
    }
}
