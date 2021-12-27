import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[]
  currentCategoryId: number;
  previousCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean
  keyword: string;
  previousKeyword: string;

  //pagination elements
  page: number = 1;
  size: number = 5;
  totalElements: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => this.listProducts()
    );
  }

  updatePageSize(size : number) {
    this.size = size;
    this.page = 1;
    this.listProducts();
  }

  listProducts() {

    // check if id parameter is available
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.currentCategoryName = 'All';
      this.keyword = this.route.snapshot.paramMap.get('keyword')!;

      if(this.previousKeyword != this.keyword) {
        this.page = 1;
      }
      this.previousKeyword = this.keyword;
      
      this.productService.getPageableProductsByKeyword(this.keyword, this.page - 1, this.size).subscribe(
        data => {
          this.products = data._embedded.products;
          this.page = data.page.number + 1;
          this.size = data.page.size;
          this.totalElements = data.page.totalElements;
        }
      );

    } else {
      let hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      let hasCategoryName: boolean = this.route.snapshot.paramMap.has('categoryName');

      this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1;
      this.currentCategoryName = hasCategoryName ? this.route.snapshot.paramMap.get('categoryName')! : 'Books';

      if (this.previousCategoryId != this.currentCategoryId) {
        this.page = 1;
      } 
        this.previousCategoryId = this.currentCategoryId
        this.productService.getPageableProductList(this.currentCategoryId, this.page - 1, this.size).subscribe(
          data => {
            this.products = data._embedded.products;
            this.page = data.page.number + 1;
            this.size = data.page.size;
            this.totalElements = data.page.totalElements;
          }
        );


    }

  }
}
