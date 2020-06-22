import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AlertService } from "app/services/alert.service";
import { FileList } from "../models/file-list.model";
import { FilesService } from "app/services/files.service";

@Injectable()
export class FileListResolver implements Resolve<FileList[]> {
    pageNumber: number;
    pageSize: number;
    constructor(
        private fileService: FilesService,
        private router: Router,
        private alert: AlertService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<FileList[]> {
        this.pageNumber = 1;
        this.pageSize = this.fileService.itemPerPage;
        return this.fileService.getFiles(this.pageNumber, this.pageSize).pipe(
            catchError((error) => {
                this.alert.Error("", error.statusText);
                this.router.navigate(["/dashboard"]);
                return of(null);
            })
        );
    }
}
