import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, retry, catchError } from "rxjs/operators";
import { environment } from "environments/environment";
import { Department } from "app/models/department.model";
import { PaginatedResult } from "app/models/pagination.model";

@Injectable({
    providedIn: "root",
})
export class DepartmentService {
    private baseUrl = environment.apiUrl;
    public itemPerPage = environment.itemPerPage;

    constructor(private http: HttpClient) {}

    getDepartment(id: any): Observable<Department> {
        return this.http.get<Department>(this.baseUrl + "department/" + id);
    }

    addDepartment(model: any) {
        return this.http.post(this.baseUrl + "department/", model);
    }

    editDepartment(id: any, model: any) {
        return this.http.put(this.baseUrl + "department/" + id, model);
    }

    deleteDepartment(id: any) {
        return this.http.delete(this.baseUrl + "department/" + id);
    }

    getDepartmentReport() {
        return this.http.get(this.baseUrl + "report/department/");
    }

    getDepartments(
        page?,
        itemsPerPage?,
        departmentParams?
    ): Observable<PaginatedResult<Department[]>> {
        const paginatedResult: PaginatedResult<
            Department[]
        > = new PaginatedResult<Department[]>();

        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append("pageNumber", page);
            params = params.append("pageSize", itemsPerPage);
        }
        if (departmentParams != null) {
            if (departmentParams.code != null) {
                params = params.append("code", departmentParams.code);
            }
            if (departmentParams.name != null) {
                params = params.append("name", departmentParams.name);
            }
            if (departmentParams.OrderBy != null) {
                params = params.append("OrderBy", departmentParams.OrderBy);
                params = params.append("isDescending", departmentParams.isDescending);
            }
        }

        return this.http
            .get<Department[]>(this.baseUrl + "department/paged", {
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
