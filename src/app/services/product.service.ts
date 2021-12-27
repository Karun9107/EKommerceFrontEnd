import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators'
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  constructor(private httpClient:HttpClient) { }

  getPageableProductList(categoryId : number, page :number, size :number): Observable<GetResponseForProducts> {
    let searchUrl : string = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    return this.httpClient.get<GetResponseForProducts>(`${searchUrl}&page=${page}&size=${size}`).pipe(
      map(response => response)
    )
  }

  getPageableProductsByKeyword(keyword : string, page :number, size :number): Observable<GetResponseForProducts> {
    let searchUrl : string = `${this.baseUrl}/search/findByNameContaining?name=${encodeURIComponent(keyword)}`
    return this.httpClient.get<GetResponseForProducts>(`${searchUrl}&page=${page}&size=${size}`).pipe(
      map(response => response)
    )
  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    let categoryUrl : string = 'http://localhost:8080/api/product-category';
    return this.httpClient.get<GetResponseForProductCategories>(categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProduct(id:number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`)
  }
}

 export interface GetResponseForProducts {
    _embedded: {
      products : Product[];
    },
    page : {
      size : number;
      totalElements : number;
      totalPages : number;
      number : number;
    }
}

interface GetResponseForProductCategories {
  _embedded: {
    productCategory : ProductCategory[];
  }, 
  page : {
    size : number;
    totalElements : number;
    totalPages : number;
    number : number;
  }
}



