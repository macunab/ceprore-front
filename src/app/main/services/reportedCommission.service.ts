import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ReportedCommission } from "../interfaces/reportedCommision.interface";
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ReportedCommissionService {

    private readonly baseUrl: string = `${environment.baseUrl}/reported-commission`;

    constructor(private http: HttpClient) {}

    createNewReportedCommision(reportedCommision: ReportedCommission): Observable<Blob> {
        
        const headers = new HttpHeaders()
        .set('authorization', `Beared ${localStorage.getItem('token')}`);
        return this.http.post(this.baseUrl, reportedCommision, { responseType: 'blob', headers })
            .pipe(
                catchError(({error}) => {
                    return throwError(() => `Error: ${error.message}`)
                })
            );
    }

    findAllReportedCommisions(): Observable<Array<ReportedCommission>> {

        const headers = new HttpHeaders()
            .set('authorization', `Beared ${localStorage.getItem('token')}`);
        return this.http.get<Array<ReportedCommission>>(this.baseUrl, { headers })
            .pipe(
                catchError(({error}) => {
                    return throwError(() => `Error: ${error.message}`)
                })
            );
    }

    printReport(reportedCommision: ReportedCommission): Observable<Blob> {

        const { _id, updatedAt, __v, ...reportData } = reportedCommision;
        const url: string = `${this.baseUrl}/print-reported`;
        const headers = new HttpHeaders()
            .set('authorization', `Beared ${localStorage.getItem('token')}`);
        return this.http.post(url, reportData, { responseType: 'blob', headers })
            .pipe(
                catchError(({error}) => {
                    return throwError(() => `Error: ${error.message}`)
                })
            );
    }
}