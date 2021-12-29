import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EKommerceFormService {

  maxCreditCardAgeInYears:number = 10

  constructor() { }

  getMonths(startMonth : number) : Observable<number[]> {
    console.log(JSON.stringify(this.rangeToArray(startMonth, 12)));
    return of(this.rangeToArray(startMonth, 12));
  }

  getValidCreditCardYeards(startYear : number) : Observable<number[]> {
    return of(this.rangeToArray(startYear, startYear + this.maxCreditCardAgeInYears));
  }

  rangeToArray(start: number, end:number) : number[]{
    return [...Array(end - start + 1).keys()].map(x => x + start);
  }
}
