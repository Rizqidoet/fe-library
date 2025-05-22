import { Injectable } from '@angular/core';
import { environment as env } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Paging, ResponsePagination, ResponseEntity } from '../../../../shared/dto/global-model.model';
import { TrxRentDto } from '../model/rent.model';

@Injectable({
  providedIn: 'root'
})
export class RentService {

 private baseUrl = env.apiBaseUrl;
  

  constructor(
    private http: HttpClient
  ) { }

  list(params?: Params): Observable<[TrxRentDto[], Paging]> {
    return this.http.get<ResponsePagination<TrxRentDto[]>>(`${this.baseUrl}/trx-rent`, { params }).pipe(
      map(({ data, paging }: ResponsePagination<TrxRentDto[]>) => [ data, paging ])
    );
  }

  getSingle(id: number): Observable<TrxRentDto> {
    return this.http.get<ResponseEntity<TrxRentDto>>(`${this.baseUrl}/trx-rent/${id}`).pipe(
      map(({data}: ResponseEntity<TrxRentDto>) => data)
    );
  }

  create(payload: TrxRentDto): Observable<TrxRentDto> {
    return this.http.post<ResponseEntity<TrxRentDto>>(`${this.baseUrl}/trx-rent`, payload).pipe(
      map(({data}: ResponseEntity<TrxRentDto>) => data)
    );
  }

  update(id: number, user: TrxRentDto): Observable<TrxRentDto> {
    return this.http.put<ResponseEntity<TrxRentDto>>(`${this.baseUrl}/trx-rent/${id}`, user).pipe(
      map(({data}: ResponseEntity<TrxRentDto>) => data)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/trx-rent/${id}`);
  }
}
