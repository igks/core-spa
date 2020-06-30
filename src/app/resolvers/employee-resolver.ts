import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Employee } from "../models/employee.model";
import { EmployeeService } from "app/services/employee.service";
import { AlertService } from "app/services/alert.service";

@Injectable()
export class EmployeeListResolver implements Resolve<Employee[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Employee[]> {
        this.pageNumber = 1;
        this.pageSize = this.employeeService.itemPerPage;
        return this.employeeService
            .getEmployees(this.pageNumber, this.pageSize)
            .pipe(
                catchError((error) => {
                    this.alert.Error("", error.statusText);
                    this.router.navigate(["/dashboard"]);
                    return of(null);
                })
            );
    }
}

@Injectable()
export class EmployeeDetailResolver implements Resolve<Employee> {
    constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Employee> {
        return this.employeeService.getEmployee(route.params.id).pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/pages/master/employee"]);
                return of(null);
            })
        );
    }
}

@Injectable()
export class EmployeeReportResolver implements Resolve<Employee[]> {
    constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Employee[]> {
        return this.employeeService.getEmployeeReport().pipe(
            catchError((error) => {
                this.alert.Error("", error);
                this.router.navigate(["/pages/master/employee"]);
                return of(null);
            })
        );
    }
}
