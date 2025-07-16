import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DosukuHttpService {
  private readonly url = 'https://sudoku-api.vercel.app/api/dosuku';

  private httpClient = inject(HttpClient);

  /**
   * Funktion zum Anfordern einer Entität mittels GET
   * @param id - Die ID der benötigten Entität
   * @return gibt ein Observable vom Typ T (BaseModel)
   */
  public getSingle<T>(): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    return this.httpClient
      .get<T>(`${this.url}`, { headers })
      .pipe(map(data => data as T));
  }
}
