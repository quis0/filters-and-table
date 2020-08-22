import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerApiService {
  obs$;
  getData() {
    return this.obs$ = ajax.getJSON('https://gist.githubusercontent.com/bunopus/f48fbb06578003fb521c7c1a54fd906a/raw/e5767c1e7f172c6375f064a9441f2edd57a79f15/test_users.json')
      .pipe(
        catchError(error => {
          return of(error);
        })
      )
  }
  constructor() { }

}
