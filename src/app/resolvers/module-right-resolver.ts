import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ModuleRight } from "../models/module-right.model";
import { ModuleRightService } from "app/services/module-right.service";
import { AlertService } from "app/services/alert.service";

@Injectable()
export class ModuleRightListResolver implements Resolve<ModuleRight[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private moduleService: ModuleRightService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ModuleRight[]> {
        this.pageNumber = 1;
        this.pageSize = this.moduleService.itemPerPage;
        return this.moduleService
            .getModules(this.pageNumber, this.pageSize)
            .pipe(
                catchError(error => {
                    this.alert.Error("", error.statusText);
                    this.router.navigate(["/dashboard"]);
                    return of(null);
                })
            );
    }
}

@Injectable()
export class ModuleRightDetailResolver implements Resolve<ModuleRight> {
    constructor(
        private moduleService: ModuleRightService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ModuleRight> {
        return this.moduleService.getModule(route.params.id).pipe(
            catchError(error => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/pages/master/moduleright"]);
                return of(null);
            })
        );
    }
}