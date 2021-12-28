import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cart : CartItem[] = [];
  totalPrice : number = 0;
  totalQuantity : number = 0;

  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.getCartDetails();
  }
  getCartDetails() {
    this.cart = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe( data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe( data => this.totalQuantity = data);
    this.cartService.computeCartTotals();
    console.log("totalPrice = " + this.totalPrice);
    console.log("totalQuantity = " + this.totalQuantity);
  }

  incrementItemQuantity(item : CartItem) {
   this.cartService.addToCart(item);
  }

  decrementItemQuantity(item : CartItem) {
    --item.quantity;
    if(item.quantity < 1) {
      this.cartService.removeItem(item);
    } else {
      this.cartService.computeCartTotals();
    }
  }
  removeItem(item: CartItem) {
    this.cartService.removeItem(item);
  }
}
