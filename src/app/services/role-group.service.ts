import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, retry, catchError } from "rxjs/operators";
import { environment } from "environments/environment";
import { RoleGroup } from "app/models/role-group.model";
import { PaginatedResult } from "app/models/pagination.model";

@Injectable({
    providedIn: "root",
})
export class RoleGroupService {
    private baseUrl = environment.apiUrl;
    public itemPerPage = environment.itemPerPage;

    constructor(private http: HttpClient) {}

    getRoleGroup(id: any): Observable<RoleGroup> {
        return this.http.get<RoleGroup>(this.baseUrl + "rolegroup/" + id);
    }

    getAllRoleGroup(): Observable<RoleGroup[]> {
        return this.http.get<RoleGroup[]>(this.baseUrl + "rolegroup/");
    }

    addRoleGroup(model: any) {
        return this.http.post(this.baseUrl + "rolegroup/", model);
    }

    editRoleGroup(id: number, model: any) {
        return this.http.put(this.baseUrl + "rolegroup/" + id, model);
    }

    deleteRoleGroup(id: number) {
        return this.http.delete(this.baseUrl + "rolegroup/" + id);
    }

    getRoleGroups(
        page?,
        itemPerPage?,
        roleGroupParams?
    ): Observable<PaginatedResult<RoleGroup[]>> {
        const paginatedResult: PaginatedResult<
            RoleGroup[]
        > = new PaginatedResult<RoleGroup[]>();

        let params = new HttpParams();
        if (page != null && itemPerPage != null) {
            params = params.append("pageNumber", page);
            params = params.append("pageSize", itemPerPage);
        }
        if (roleGroupParams != null) {
            if (roleGroupParams.code != null) {
                params = params.append("code", roleGroupParams.code);
            }
            if (roleGroupParams.name != null) {
                params = params.append("name", roleGroupParams.name);
            }
            if (roleGroupParams.OrderBy != null) {
                params = params.append("OrderBy", roleGroupParams.OrderBy);
                params = params.append(
                    "isDescending",
                    roleGroupParams.isDescending
                );
            }
        }

        return this.http
            .get<RoleGroup[]>(this.baseUrl + "rolegroup/paged", {
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
