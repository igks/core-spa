import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpParams,
    HttpEvent,
    HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, retry, catchError } from "rxjs/operators";
import { environment } from "environments/environment";
import { User } from "app/models/user.model";
import { PaginatedResult } from "app/models/pagination.model";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private baseUrl = environment.apiUrl;
    public itemPerPage = environment.itemPerPage;

    constructor(private http: HttpClient) {}

    getUser(id: any): Observable<User> {
        return this.http.get<User>(this.baseUrl + "user/" + id);
    }

    addUser(model: any): Observable<User> {
        return this.http.post<User>(this.baseUrl + "user/", model);
    }

    editUser(id: any, model: any): Observable<User> {
        return this.http.put<User>(this.baseUrl + "user/" + id, model);
    }

    uploadPhoto(id: any, file: Blob): Observable<User> {
        const formData = new FormData();
        formData.append("file", file);
        return this.http.put<User>(this.baseUrl + "user/photo/" + id, formData);
    }

    deleteUser(id: any) {
        return this.http.delete(this.baseUrl + "user/" + id);
    }

    getUserReport() {
        return this.http.get(this.baseUrl + "reoort/user/");
    }

    getUsers(
        page?,
        itemPerPage?,
        userParams?
    ): Observable<PaginatedResult<User[]>> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
            User[]
        >();

        let params = new HttpParams();
        if (page != null && itemPerPage != null) {
            params = params.append("pageNumber", page);
            params = params.append("pageSize", itemPerPage);
        }

        if (userParams != null) {
            if (userParams.fistname != null) {
                params = params.append("firstname", userParams.firstname);
            }

            if (userParams.OrderBy != null) {
                params = params.append("OrderBy", userParams.OrderBy);
                params = params.append("isDescending", userParams.isDescending);
            }
        }

        return this.http
            .get<User[]>(this.baseUrl + "user/paged", {
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
