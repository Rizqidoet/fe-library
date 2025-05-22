import { Injectable } from '@angular/core';
import { environment as env } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Paging, ResponseEntity, ResponsePagination } from '../../../../shared/dto/global-model.model';
import { CatalogueDto } from '../model/catalogue.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
private baseUrl = env.apiBaseUrl;;
  

  constructor(
    private http: HttpClient
  ) { }

  list(params?: Params): Observable<[CatalogueDto[], Paging]> {
    return this.http.get<ResponsePagination<CatalogueDto[]>>(`${this.baseUrl}/catalogue`, { params }).pipe(
      map(({ data, paging }: ResponsePagination<CatalogueDto[]>) => [ data, paging ])
    );
  }
  getSingle(id: number): Observable<CatalogueDto> {
    return this.http.get<ResponseEntity<CatalogueDto>>(`${this.baseUrl}/catalogue/${id}`).pipe(
      map(({data}: ResponseEntity<CatalogueDto>) => data)
    );
  }

  create(payload: CatalogueDto): Observable<CatalogueDto> {
    return this.http.post<ResponseEntity<CatalogueDto>>(`${this.baseUrl}/catalogue`, payload).pipe(
      map(({data}: ResponseEntity<CatalogueDto>) => data)
    );
  }

  update(id: number, payload: CatalogueDto): Observable<CatalogueDto> {
    return this.http.put<ResponseEntity<CatalogueDto>>(`${this.baseUrl}/catalogue/${id}`, payload).pipe(
      map(({data}: ResponseEntity<CatalogueDto>) => data)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/catalogue/${id}`);
  }
}
