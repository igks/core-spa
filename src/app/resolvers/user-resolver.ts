import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AlertService } from "app/services/alert.service";
import { User } from "../models/user.model";
import { UserService } from "app/services/user.service";

@Injectable()
export class UserListResolver implements Resolve<User[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private userService: UserService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        this.pageNumber = 1;
        this.pageSize = this.userService.itemPerPage;
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/dashboard"]);
                return of(null);
            })
        );
    }
}

@Injectable()
export class UserDetailResolver implements Resolve<User> {
    constructor(
        private userService: UserService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(route.params.id).pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/pages/master/user"]);
                return of(null);
            })
        );
    }
}

@Injectable()
export class UserReportResolver implements Resolve<User[]> {
    constructor(
        private userService: UserService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUserReport().pipe(
            catchError((error) => {
                this.alert.Error("", error);
                this.router.navigate(["/pages/master/user"]);
                return of(null);
            })
        );
    }
}
