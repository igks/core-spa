import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { RoleGroup } from "../models/role-group.model";
import { RoleGroupService } from "app/services/role-group.service";
import { AlertService } from "app/services/alert.service";

@Injectable()
export class RoleGroupListResolver implements Resolve<RoleGroup[]> {
    constructor(
        private groupService: RoleGroupService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<RoleGroup[]> {
        return this.groupService.getRoleGroups().pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/dashboard"]);
                return of(null);
            })
        );
    }
}

@Injectable()
export class RoleGroupDetailResolver implements Resolve<RoleGroup> {
    constructor(
        private groupService: RoleGroupService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<RoleGroup> {
        return this.groupService.getRoleGroup(route.params.id).pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/pages/master/department"]);
                return of(null);
            })
        );
    }
}
