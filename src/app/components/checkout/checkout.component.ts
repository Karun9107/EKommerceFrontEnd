import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup : FormGroup;
  totalPrice:number = 0;
  totalQuantity:number = 0;

  constructor(private formBuilder : FormBuilder, private cartService:CartService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({ 
      customer : this.formBuilder.group({
        firstName : [''],
        lastName : [''],
        email : ['']
      }),
      shippingAddress : this.formBuilder.group({
        street : [''],
        city : [''],
        state : [''],
        country : [''],
        zipCode : ['']
      }),
      billingAddress : this.formBuilder.group({
        street : [''],
        city : [''],
        state : [''],
        country : [''],
        zipCode : ['']
      }),
      creditCardInfo : this.formBuilder.group({
        type: [''],
        name : [''],
        number : [''],
        cvv : [''],
        expirationMonth : [''],
        expirationYear : ['']
      }),
      })

      this.showBill();
  }
  showBill() {
   this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
   this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
   this.cartService.computeCartTotals();
  }

  copyShippingAddressToBillingAddress(event:Event) {
    if ((event.target instanceof HTMLInputElement)) {
        if(event.target.checked) {
          this.checkoutFormGroup.get('billingAddress')?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
        } else {
          this.checkoutFormGroup.get('billingAddress')?.reset();
        }
    }
  }

  onSubmit() {
    console.log("purchase button works customerDetails = " + JSON.stringify(this.checkoutFormGroup.get('customer')?.value));
    console.log("purchase button works shippingAddress = " + JSON.stringify(this.checkoutFormGroup.get('shippingAddress')?.value));
  }
}
