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
  currentCategoryName: string;
  constructor(private productService: ProductService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () =>  this.listProducts()
    );
  }

  listProducts() {

    // check if id parameter is available
    let hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');
    let hasCategoryName : boolean = this.route.snapshot.paramMap.has('categoryName');
 
    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1;
    this.currentCategoryName = hasCategoryName ? this.route.snapshot.paramMap.get('categoryName')! : 'Books';

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => this.products = data
    );

  }

}
