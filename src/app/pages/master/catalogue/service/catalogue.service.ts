import { Injectable } from '@angular/core';
import { environment as env } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Paging, ResponsePagination } from '../../../../shared/dto/global-model.model';
import { UserDto } from '../../user/model/user.model';
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
}
