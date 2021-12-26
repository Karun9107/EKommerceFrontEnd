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

  getProductList(categoryId : number): Observable<Product[]> {
    let searchUrl : string = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    return this.httpClient.get<GetResponseForProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    let categoryUrl : string = 'http://localhost:8080/api/product-category';
    return this.httpClient.get<GetResponseForProductCategories>(categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }
}

interface GetResponseForProducts {
    _embedded: {
      products : Product[];
    }
}

interface GetResponseForProductCategories {
  _embedded: {
    productCategory : ProductCategory[];
  }
}



