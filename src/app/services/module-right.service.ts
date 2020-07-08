import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, retry, catchError } from "rxjs/operators";
import { environment } from "environments/environment";
import { ModuleRight } from "app/models/module-right.model";
import { PaginatedResult } from "app/models/pagination.model";

@Injectable({
    providedIn: "root",
})
export class ModuleRightService {
    private baseUrl = environment.apiUrl;
    public itemPerPage = environment.itemPerPage;

    constructor(private http: HttpClient) {}

    getModule(id: any): Observable<ModuleRight> {
        return this.http.get<ModuleRight>(this.baseUrl + "moduleright/" + id);
    }

    getAllModules(): Observable<ModuleRight[]> {
        return this.http.get<ModuleRight[]>(this.baseUrl + "moduleright/");
    }

    addModule(model: any) {
        return this.http.post(this.baseUrl + "moduleright/", model);
    }

    editModule(id: any, model: any) {
        return this.http.put(this.baseUrl + "moduleright/" + id, model);
    }

    deleteModule(id: any) {
        return this.http.delete(this.baseUrl + "moduleright/" + id);
    }

    getModules(
        page?,
        itemsPerPage?,
        moduleParams?
    ): Observable<PaginatedResult<ModuleRight[]>> {
        const paginatedResult: PaginatedResult<
            ModuleRight[]
        > = new PaginatedResult<ModuleRight[]>();

        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append("pageNumber", page);
            params = params.append("pageSize", itemsPerPage);
        }
        if (moduleParams != null) {
            if (moduleParams.code != null) {
                params = params.append("code", moduleParams.code);
            }
            if (moduleParams.name != null) {
                params = params.append("name", moduleParams.name);
            }
            if (moduleParams.OrderBy != null) {
                params = params.append("OrderBy", moduleParams.OrderBy);
                params = params.append("isDescending", moduleParams.isDescending);
            }
        }

        return this.http
            .get<ModuleRight[]>(this.baseUrl + "moduleright/paged", {
                observe: "response",
                params,
            })
            .pipe(
                map((response) => {
                    paginatedResult.result = response.body;
                    if (response.headers.get("Pagination") != null) {
                        paginatedResult.pagination = JSON.parse(
                            response.headers.get("Pagination")
                        );
                    }
                    return paginatedResult;
                })
            );
    }
}
