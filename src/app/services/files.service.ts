import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpRequest,
    HttpEvent,
    HttpParams,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { PaginatedResult } from "app/models/pagination.model";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class FilesService {
    private baseUrl = environment.apiUrl;
    private apiFileUrl = environment.apiUrl + "files/file-list";

    public itemPerPage = environment.itemPerPage;

    constructor(private http: HttpClient) {}

    public downloadFile(file: string): Observable<HttpEvent<Blob>> {
        return this.http.request(
            new HttpRequest(
                "GET",
                this.baseUrl + "files/download?file=" + file,
                null,
                {
                    reportProgress: true,
                    responseType: "blob",
                }
            )
        );
    }

    public uploadFile(file: Blob): Observable<HttpEvent<void>> {
        const formData = new FormData();
        formData.append("file", file);

        return this.http.request(
            new HttpRequest("POST", this.baseUrl + "files/upload", formData, {
                reportProgress: true,
            })
        );
    }

    public getFiles(
        page = 1,
        itemsPerPage = this.itemPerPage,
        filesParams = null
    ): Observable<PaginatedResult<FileList[]>> {
        const paginatedResult: PaginatedResult<
            FileList[]
        > = new PaginatedResult<FileList[]>();

        let params = new HttpParams();
        params = params.append("pageNumber", page.toString());
        params = params.append("pageSize", itemsPerPage.toString());

        if (filesParams != null) {
            Object.keys(filesParams).forEach((key) => {
                if (filesParams[key] != null) {
                    params = params.append(key, filesParams[key]);
                }
            });
        }

        return this.http
            .get<FileList[]>(this.apiFileUrl, {
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

    public deleteFile(file: string): Observable<string> {
        return this.http.delete<string>(
            this.baseUrl + "files/delete?file=" + file
        );
    }

    public createFile(): Observable<string> {
        return this.http.post<string>(this.baseUrl + "files/create", null);
    }
}
