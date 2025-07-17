import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Difficulties } from '../../new-game-dialog/new-game-dialog.component';

@Injectable()
export class DosukuHttpService {
  private readonly baseUrl = 'http://localhost:3000/api/dosuku';

  private httpClient = inject(HttpClient);

  /**
   * Funktion zum Anfordern einer Entität mittels GET
   * @param id - Die ID der benötigten Entität
   * @return gibt ein Observable vom Typ T (BaseModel)
   */
  public getSingle<T>(difficulty: Difficulties): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    const query = `query={newboard(limit:1,difficulty:"${difficulty}"){grids{value,solution,difficulty},results,message}}`;
    console.log(query);
    return this.httpClient
      .get<T>(`${this.baseUrl}?${query}`, { headers })
      .pipe(map(data => data as T));
  }
}
