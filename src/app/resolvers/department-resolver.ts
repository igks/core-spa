import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Department } from "../models/department.model";
import { DepartmentService } from "app/services/department.service";
import { AlertService } from "app/services/alert.service";

@Injectable()
export class DepartmentListResolver implements Resolve<Department[]> {
    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Department[]> {
        return this.departmentService.getDepartments().pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/dashboard"]);
                return of(null);
            })
        );
    }
}

@Injectable()
export class DepartmentDetailResolver implements Resolve<Department> {
    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Department> {
        return this.departmentService.getDepartment(route.params.id).pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/pages/master/department"]);
                return of(null);
            })
        );
    }
}

@Injectable()
export class DepartmentReportResolver implements Resolve<Department[]> {
    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Department[]> {
        return this.departmentService.getDepartmentReport().pipe(
            catchError((error) => {
                this.alert.Error("", error);
                this.router.navigate(["/pages/master/department"]);
                return of(null);
            })
        );
    }
}
