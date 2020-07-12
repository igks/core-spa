import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
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

    getAllDepartment(): Observable<Department[]> {
        return this.http.get<Department[]>(this.baseUrl + "department/");
    }

    getSubDepartment(id: any): Observable<Department[]> {
        return this.http.get<Department[]>(
            this.baseUrl + "department/sub/" + id
        );
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
        page = 1,
        itemsPerPage = this.itemPerPage,
        departmentParams = null
    ): Observable<PaginatedResult<Department[]>> {
        const paginatedResult: PaginatedResult<
            Department[]
        > = new PaginatedResult<Department[]>();

        let params = new HttpParams();
        params = params.append("pageNumber", page.toString());
        params = params.append("pageSize", itemsPerPage.toString());

        if (departmentParams != null) {
            Object.keys(departmentParams).forEach((key) => {
                if (departmentParams[key] != null) {
                    params = params.append(key, departmentParams[key]);
                }
            });
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
