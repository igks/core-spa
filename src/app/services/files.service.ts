import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpRequest,
    HttpEvent,
    HttpResponse,
} from "@angular/common/http";
import { of, Observable } from "rxjs";
import { environment } from "environments/environment";

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

    public getFiles(): Observable<string[]> {
        return this.http.get<string[]>(this.apiFileUrl);
    }

    public deleteFile(file: string): Observable<string> {
        return this.http.delete<string>(`${this.apiDeleteUrl}?file=${file}`);
    }

    public createFile(): Observable<string> {
        return this.http.post<string>(this.apiCreateUrl, null);
    }
}
