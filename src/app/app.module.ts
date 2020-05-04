import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";

import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";

import { fuseConfig } from "app/fuse-config";

import { AppComponent } from "app/app.component";
import { AppStoreModule } from "app/store/store.module";
import { LayoutModule } from "app/layout/layout.module";
import { LoginModule } from "./main/pages/authentication/login/login.module";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { FakeDbService } from "./fake-db/fake-db.service";
import { ToastrModule } from "ngx-toastr";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmDialogModule } from "./layout/components/confirm-dialog/confirm-dialog.module";
import { AuthInterceptor } from "./services/auth.interceptor";
import { BlankComponent } from "./main/ui/page-layouts/blank/blank.component";
import { ErrorInterceptorProvider } from "./services/error.interceptor";
import { DashboardComponent } from "./main/dummy/dashboard/dashboard.component";
import { Report1Component } from "./main/dummy/report1/report1.component";
import { Report2Component } from "./main/dummy/report2/report2.component";
import { Transaction1Component } from "./main/dummy/transaction1/transaction1.component";
import { Transaction2Component } from "./main/dummy/transaction2/transaction2.component";

const appRoutes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent,
    },
    {
        path: "report1",
        component: Report1Component,
    },
    {
        path: "report2",
        component: Report2Component,
    },
    {
        path: "transaction1",
        component: Transaction1Component,
    },
    {
        path: "transaction2",
        component: Transaction2Component,
    },
    {
        path: "pages",
        loadChildren: "./main/pages/pages.module#PagesModule",
    },
    {
        path: "**",
        redirectTo: "auth/login",
    },
];

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        Report1Component,
        Report2Component,
        Transaction1Component,
        Transaction2Component,
    ],
    imports: [
        ToastrModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true,
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatDialogModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LoginModule,
        LayoutModule,
        AppStoreModule,
        ConfirmDialogModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        AuthService,
        ErrorInterceptorProvider,
    ],
})
export class AppModule {}

// Old route
// const appRoutes: Routes = [
//     {
//         path: "login",
//         redirectTo: "auth/login",
//     },
//     {
//         path: "apps",
//         loadChildren: "./main/apps/apps.module#AppsModule",
//         canActivate: [AuthGuard],
//     },
//     {
//         path: "pages",
//         loadChildren: "./main/pages/pages.module#PagesModule",
//         canActivate: [AuthGuard],
//     },
//     {
//         path: "ui",
//         loadChildren: "./main/ui/ui.module#UIModule",
//         canActivate: [AuthGuard],
//     },
//     {
//         path: "documentation",
//         loadChildren:
//             "./main/documentation/documentation.module#DocumentationModule",
//         canActivate: [AuthGuard],
//     },
//     {
//         path: "angular-material-elements",
//         loadChildren:
//             "./main/angular-material-elements/angular-material-elements.module#AngularMaterialElementsModule",
//         canActivate: [AuthGuard],
//     },
//     {
//         path: "**",
//         redirectTo: "auth/login",
//     },
// ];
