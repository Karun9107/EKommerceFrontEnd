import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class EKommerceFormService {

  baseUrl = "http://localhost:8080/api"

  maxCreditCardAgeInYears:number = 10

  constructor(private httpClient : HttpClient) { }

  getMonths(startMonth : number) : Observable<number[]> {
    return of(this.rangeToArray(startMonth, 12));
  }

  getValidCreditCardYeards(startYear : number) : Observable<number[]> {
    return of(this.rangeToArray(startYear, startYear + this.maxCreditCardAgeInYears));
  }

  rangeToArray(start: number, end:number) : number[]{
    return [...Array(end - start + 1).keys()].map(x => x + start);
  }

  getCountries() : Observable<Country[]> {
    return this.httpClient.get<CountryResponse>(`${this.baseUrl}/country`).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStatesByCountryCode(code : string) : Observable<State[]> {
    return this.httpClient.get<StateResponse>(`${this.baseUrl}/state/search/findByCountryCode?code=${code}`).pipe(
      map(response => response._embedded.states)
    );
  }


}

interface StateResponse {
    _embedded : {
      states : State[]
    }
}

interface CountryResponse {
  _embedded : {
    countries : Country[]
  }
}