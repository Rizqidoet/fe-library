import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserDto } from '../model/user.model';
import { Paging, ResponseEntity, ResponsePagination } from '../../../../shared/dto/global-model.model';
import { environment as env } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = env.apiBaseUrl;;
  

  constructor(
    private http: HttpClient
  ) { }

  list(params?: Params): Observable<[UserDto[], Paging]> {
    return this.http.get<ResponsePagination<UserDto[]>>(`${this.baseUrl}/users`, { params }).pipe(
      map(({ data, paging }: ResponsePagination<UserDto[]>) => [ data, paging ])
    );
  }

  getSingle(id: number): Observable<UserDto> {
    return this.http.get<ResponseEntity<UserDto>>(`${this.baseUrl}/users/${id}`).pipe(
      map(({data}: ResponseEntity<UserDto>) => data)
    );
  }

  create(payload: UserDto): Observable<UserDto> {
    return this.http.post<ResponseEntity<UserDto>>(`${this.baseUrl}/users`, payload).pipe(
      map(({data}: ResponseEntity<UserDto>) => data)
    );
  }

  update(id: number, user: UserDto): Observable<UserDto> {
    return this.http.put<ResponseEntity<UserDto>>(`${this.baseUrl}/users/${id}`, user).pipe(
      map(({data}: ResponseEntity<UserDto>) => data)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
