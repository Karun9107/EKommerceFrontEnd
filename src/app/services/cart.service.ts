import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(item: CartItem) {
    //check if we already have the item in the cart
    let productAlreadyExists = false;
    let currentCartItem = undefined;


    if (this.cartItems.length > 0) {
      //find the item in the cart based on the item id
      currentCartItem = this.cartItems.find(cartItem => cartItem.id === item.id)

      productAlreadyExists = (currentCartItem != undefined)

    }
    //if found increase the quanitity of the item
    //else add the product to cart
    productAlreadyExists ? currentCartItem!.quantity++ : this.cartItems.push(item);

    // publish the total price and quantity
    this.computeCartTotals();
  }

  removeItem(item: CartItem) {
    this.cartItems.splice(this.cartItems.indexOf(item), 1);
    this.computeCartTotals();
  }
  
  computeCartTotals() {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for (let item of this.cartItems) {
      totalPrice += item.quantity * item.unitPrice;
      totalQuantity += item.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }
}
