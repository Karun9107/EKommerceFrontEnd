import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
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
  searchResult : boolean = false;
  keyword : string;
  constructor(private productService: ProductService, private cartService: CartService,  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe ( () => 
    this.getProductDetails()
    );
  }

  getProductDetails() {
    this.searchResult = this.route.snapshot.paramMap.has('keyword')
    if(this.searchResult) {
      this.keyword =  this.route.snapshot.paramMap.get('keyword')!
    } else {
    this.currentCategoryId = +this.route.snapshot.paramMap.get('cat-id')!
    this.currentCategoryName =  this.route.snapshot.paramMap.get('cat-name')!
    }
    return this.productService.getProduct(+this.route.snapshot.paramMap.get('id')!).subscribe(
      data => this.product = data
    );
  }

  addToCart() {
    let item : CartItem = new CartItem(this.product);

    this.cartService.addToCart(item);
  }
}
