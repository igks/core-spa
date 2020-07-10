import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule, MatOption } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AgmCoreModule } from "@agm/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { FuseSharedModule } from "@fuse/shared.module";
import { FuseWidgetModule } from "@fuse/components/widget/widget.module";

import { AuthGuard } from "app/guards/auth.guard";
import {
    DepartmentListResolver,
    DepartmentDetailResolver,
} from "app/resolvers/department-resolver";
import { DepartmentService } from "app/services/department.service";
import { DepartmentListComponent } from "./department/department-list/department-list.component";
import { DepartmentFormComponent } from "./department/department-form/department-form.component";

import {
    UserListResolver,
    UserDetailResolver,
} from "app/resolvers/user-resolver";
import { UserService } from "app/services/user.service";
import { UserListComponent } from "./user/user-list/user-list.component";
import { UserFormComponent } from "./user/user-form/user-form.component";
import { UserDetailComponent } from "./user/user-detail/user-detail.component";

import { FilesComponent } from "./files/files.component";
import { UploadComponent } from "app/layout/components/upload/upload.component";
import { DownloadComponent } from "app/layout/components/download/download.component";
import { FileListResolver } from "app/resolvers/file-manager-resolver";

import { EmployeeService } from "app/services/employee.service";
import {
    EmployeeListResolver,
    EmployeeDetailResolver,
} from "app/resolvers/employee-resolver";
import { EmployeeListComponent } from "./employee/employee-list/employee-list.component";
import { EmployeeFormComponent } from "./employee/employee-form/employee-form.component";

import { ModuleRightService } from "app/services/module-right.service";
import {
    ModuleRightListResolver,
    ModuleRightDetailResolver,
} from "app/resolvers/module-right-resolver";
import { ModuleRightListComponent } from "./module-right/module-right-list/module-right-list.component";
import { ModuleRightFormComponent } from "./module-right/module-right-form/module-right-form.component";

import { RoleGroupService } from "app/services/role-group.service";
import {
    RoleGroupListResolver,
    RoleGroupDetailResolver,
} from "app/resolvers/role-group-resolver";
import { RoleGroupListComponent } from "./role-group/role-group-list/role-group-list.component";
import { RoleGroupFormComponent } from "./role-group/role-group-form/role-group-form.component";

const routes: Routes = [
    {
        path: "",
        runGuardsAndResolvers: "always",
        canActivate: [AuthGuard],
        children: [
            {
                path: "master/department",
                component: DepartmentListComponent,
                resolve: {
                    department: DepartmentListResolver,
                },
            },
            {
                path: "master/department/form",
                component: DepartmentFormComponent,
            },
            {
                path: "master/department/form/:id",
                component: DepartmentFormComponent,
                resolve: {
                    department: DepartmentDetailResolver,
                },
            },
            {
                path: "master/user",
                component: UserListComponent,
                resolve: {
                    user: UserListResolver,
                },
            },
            {
                path: "master/user/form",
                component: UserFormComponent,
            },
            {
                path: "master/user/form/:id",
                component: UserFormComponent,
                resolve: {
                    user: UserDetailResolver,
                },
            },
            {
                path: "master/user/detail/:id",
                component: UserDetailComponent,
                resolve: {
                    user: UserDetailResolver,
                },
            },
            {
                path: "master/files",
                component: FilesComponent,
                resolve: {
                    file: FileListResolver,
                },
            },
            {
                path: "master/employee",
                component: EmployeeListComponent,
                resolve: {
                    employee: EmployeeListResolver,
                },
            },
            {
                path: "master/employee/form",
                component: EmployeeFormComponent,
            },
            {
                path: "master/employee/form/:id",
                component: EmployeeFormComponent,
                resolve: {
                    employee: EmployeeDetailResolver,
                },
            },
            {
                path: "master/moduleright",
                component: ModuleRightListComponent,
                resolve: {
                    moduleright: ModuleRightListResolver,
                },
            },
            {
                path: "master/moduleright/form",
                component: ModuleRightFormComponent,
            },
            {
                path: "master/moduleright/form/:id",
                component: ModuleRightFormComponent,
                resolve: {
                    moduleright: ModuleRightDetailResolver,
                },
            },
            {
                path: "master/rolegroup",
                component: RoleGroupListComponent,
                resolve: {
                    roleGroup: RoleGroupListResolver,
                },
            },
            {
                path: "master/rolegroup/form",
                component: RoleGroupFormComponent,
            },
            {
                path: "master/rolegroup/form/:id",
                component: RoleGroupFormComponent,
                resolve: {
                    roleGroup: RoleGroupDetailResolver,
                },
            },
        ],
    },
];

@NgModule({
    declarations: [
        EmployeeListComponent,
        EmployeeFormComponent,
        DepartmentListComponent,
        DepartmentFormComponent,
        UserListComponent,
        UserFormComponent,
        UserDetailComponent,
        FilesComponent,
        UploadComponent,
        DownloadComponent,
        ModuleRightListComponent,
        ModuleRightFormComponent,
        RoleGroupListComponent,
        RoleGroupFormComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatCheckboxModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8",
        }),

        FuseSharedModule,
        FuseWidgetModule,
    ],
    providers: [
        EmployeeService,
        EmployeeListResolver,
        EmployeeDetailResolver,
        DepartmentService,
        DepartmentListResolver,
        DepartmentDetailResolver,
        UserService,
        UserListResolver,
        UserDetailResolver,
        FileListResolver,
        ModuleRightService,
        ModuleRightListResolver,
        ModuleRightDetailResolver,
        RoleGroupService,
        RoleGroupListResolver,
        RoleGroupDetailResolver,
    ],
})
export class MasterModule {}
