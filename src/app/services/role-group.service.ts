import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
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
        page = 1,
        itemPerPage = this.itemPerPage,
        roleGroupParams = null
    ): Observable<PaginatedResult<RoleGroup[]>> {
        const paginatedResult: PaginatedResult<
            RoleGroup[]
        > = new PaginatedResult<RoleGroup[]>();

        let params = new HttpParams();
        params = params.append("pageNumber", page.toString());
        params = params.append("pageSize", itemPerPage.toString());

        if (roleGroupParams != null) {
            Object.keys(roleGroupParams).forEach((key) => {
                if (roleGroupParams != null) {
                    params = params.append(key, roleGroupParams[key]);
                }
            });
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
