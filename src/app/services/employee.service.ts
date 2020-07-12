import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "environments/environment";
import { Employee } from "app/models/employee.model";
import { PaginatedResult } from "app/models/pagination.model";

@Injectable({
    providedIn: "root",
})
export class EmployeeService {
    private baseUrl = environment.apiUrl;
    public itemPerPage = environment.itemPerPage;

    constructor(private http: HttpClient) {}

    getEmployee(id: any): Observable<Employee> {
        return this.http.get<Employee>(this.baseUrl + "employee/" + id);
    }

    getAllEmployee(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.baseUrl + "employee/");
    }

    addEmployee(model: any) {
        return this.http.post(this.baseUrl + "employee/", model);
    }

    editEmployee(id: any, model: any) {
        return this.http.put(this.baseUrl + "employee/" + id, model);
    }

    deleteEmployee(id: any) {
        return this.http.delete(this.baseUrl + "employee/" + id);
    }

    getEmployeeReport() {
        return this.http.get(this.baseUrl + "report/employee/");
    }

    getEmployees(
        page = 1,
        itemsPerPage = this.itemPerPage,
        employeeParams = null
    ): Observable<PaginatedResult<Employee[]>> {
        const paginatedResult: PaginatedResult<
            Employee[]
        > = new PaginatedResult<Employee[]>();

        let params = new HttpParams();
        params = params.append("pageNumber", page.toString());
        params = params.append("pageSize", itemsPerPage.toString());

        if (employeeParams != null) {
            Object.keys(employeeParams).forEach((key) => {
                if (employeeParams[key] != null) {
                    params = params.append(key, employeeParams[key]);
                }
            });
        }

        return this.http
            .get<Employee[]>(this.baseUrl + "employee/paged", {
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
