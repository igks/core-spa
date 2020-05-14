import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpRequest,
    HttpEvent,
    HttpResponse,
    HttpParams,
} from "@angular/common/http";
import { of, Observable } from "rxjs";
import { environment } from "environments/environment";
import { PaginatedResult } from "app/models/pagination.model";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class FilesService {
    private baseApiUrl: string;
    private apiDownloadUrl: string;
    private apiUploadUrl: string;
    private apiDeleteUrl: string;
    private apiCreateUrl: string;
    private apiFileUrl: string;

    public itemPerPage = 5;

    constructor(private http: HttpClient) {
        this.baseApiUrl = environment.apiUrl;
        this.apiDownloadUrl = this.baseApiUrl + "files/download";
        this.apiUploadUrl = this.baseApiUrl + "files/upload";
        this.apiDeleteUrl = this.baseApiUrl + "files/delete";
        this.apiCreateUrl = this.baseApiUrl + "files/create";
        this.apiFileUrl = this.baseApiUrl + "files/file-list";
    }

    public downloadFile(file: string): Observable<HttpEvent<Blob>> {
        return this.http.request(
            new HttpRequest(
                "GET",
                `${this.apiDownloadUrl}?file=${file}`,
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
            new HttpRequest("POST", this.apiUploadUrl, formData, {
                reportProgress: true,
            })
        );
    }

    public getFiles(
        page?,
        itemsPerPage?,
        filesParams?
    ): Observable<PaginatedResult<FileList[]>> {
        const paginatedResult: PaginatedResult<
            FileList[]
        > = new PaginatedResult<FileList[]>();

        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append("pageNumber", page);
            params = params.append("pageSize", itemsPerPage);
        }

        if (filesParams != null) {
            if (filesParams.name != null) {
                params = params.append("name", filesParams.name);
            }
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
        return this.http.delete<string>(`${this.apiDeleteUrl}?file=${file}`);
    }

    public createFile(): Observable<string> {
        return this.http.post<string>(this.apiCreateUrl, null);
    }
}
