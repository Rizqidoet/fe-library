import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserDto } from '../model/user.model';
import { Paging, ResponseEntity, ResponsePagination } from '../../../../shared/dto/global-model.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient
  ) { }

  // list2(params: Params): Observable<{ users: UserDto[] }> {
  //   return this.http.get<{ users: UserDto[]}>(`${this.baseUrl}/users`, { params });
  // }

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


//Json POST and PUT
// create2(payload: UserDto): Observable<ResponseEntity<UserDto>> {
//   return this.http.post<ResponseEntity<UserDto>>(`${this.baseUrl}/users`).pipe(
//       map(({data}: ResponseEntity<UserDto>) => data)
//     );

//     return this.http.post('INCUBATION_CREATE', payload).pipe(
//       catchError(this.handleError),
//       map((response: ResponseEntity<UserDto>) => {
//         return response;
//       }),
//     );
//   }

// update2(payload: PackageModel, id: string): Observable<IApiResponse<CourseModel>> {
//     payload.id = id;
//     return this.http.put('UPDATE_PACKAGES', payload).pipe(
//       catchError(this.handleError),
//       map((response: IApiResponse<CourseModel>) => {
//         return response;
//       }),
//     );
//   }
}
