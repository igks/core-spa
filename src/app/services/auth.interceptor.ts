import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.token;

        if (!token) {
            return next.handle(req);
        }

        const reqHeader = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${token}`),
        });

        return next.handle(reqHeader);
    }
}
