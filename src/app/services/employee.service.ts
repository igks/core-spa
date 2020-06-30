import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, retry, catchError } from "rxjs/operators";
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
        page?,
        itemsPerPage?,
        employeeParams?
    ): Observable<PaginatedResult<Employee[]>> {
        const paginatedResult: PaginatedResult<
            Employee[]
        > = new PaginatedResult<Employee[]>();

        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append("pageNumber", page);
            params = params.append("pageSize", itemsPerPage);
        }
        if (employeeParams != null) {
            if (employeeParams.firstname != null) {
                params = params.append("firstname", employeeParams.firstname);
            }
            if (employeeParams.lastname != null) {
                params = params.append("lastname", employeeParams.lastname);
            }
            if (employeeParams.OrderBy != null) {
                params = params.append("OrderBy", employeeParams.OrderBy);
                params = params.append(
                    "isDescending",
                    employeeParams.isDescending
                );
            }
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
