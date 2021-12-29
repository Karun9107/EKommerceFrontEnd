import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { EKommerceFormService } from 'src/app/services/ekommerce-form.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup : FormGroup;
  totalPrice:number = 0;
  totalQuantity:number = 0;
  creditCardMonths:number[] = [];
  creditCardYears:number[] = [];

  constructor(private formBuilder : FormBuilder, private cartService:CartService, private formService : EKommerceFormService) { }

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

      this.formService.getMonths((new Date()).getMonth() + 1).subscribe(
        data => this.creditCardMonths = data
      );

      this.formService.getValidCreditCardYeards((new Date()).getFullYear()).subscribe(
        data => this.creditCardYears = data
      );

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

  handleMonthYearRelation() {
    let month = 1;
    const creditCardForm = this.checkoutFormGroup.get('creditCardInfo');

    console.log(JSON.stringify(creditCardForm?.value))

    if(creditCardForm?.value.expirationYear == (new Date()).getFullYear()) {
        month = (new Date()).getMonth() + 1;
    } 

    this.formService.getMonths(month).subscribe(
      data => this.creditCardMonths = data 
    );
  }
}
