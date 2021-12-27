import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();
  currentCategoryId : number;
  currentCategoryName : string;
  constructor(private productService: ProductService,  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe ( () => 
    this.getProductDetails()
    );
  }

  getProductDetails() {
    this.currentCategoryId = +this.route.snapshot.paramMap.get('cat-id')!
    this.currentCategoryName =  this.route.snapshot.paramMap.get('cat-name')!
    return this.productService.getProduct(+this.route.snapshot.paramMap.get('id')!).subscribe(
      data => this.product = data
    );
  }
}
