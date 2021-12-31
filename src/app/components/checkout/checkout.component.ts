import { Component, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { EKommerceFormService } from 'src/app/services/ekommerce-form.service';
import { EkommerceValidator } from 'src/app/validators/ekommerce-validator';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  shippingStates: State[] = [];

  billingStates: State[] = [];
  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private formService: EKommerceFormService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  //customer form  
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  // shipping form  
  get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  // shipping form  
  get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  //creditinfo form
  get type() { return this.checkoutFormGroup.get('creditCardInfo.type'); }
  get name() { return this.checkoutFormGroup.get('creditCardInfo.name'); }
  get number() { return this.checkoutFormGroup.get('creditCardInfo.number'); }
  get cvv() { return this.checkoutFormGroup.get('creditCardInfo.cvv'); }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCardInfo.expirationMonth'); }
  get expirationYear() { return this.checkoutFormGroup.get('creditCardInfo.expirationYear'); }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), EkommerceValidator.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), EkommerceValidator.notOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), EkommerceValidator.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EkommerceValidator.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, EkommerceValidator.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), EkommerceValidator.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EkommerceValidator.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, EkommerceValidator.notOnlyWhiteSpace])
      }),
      creditCardInfo: this.formBuilder.group({
        type: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.minLength(2), EkommerceValidator.notOnlyWhiteSpace]),
        number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        cvv: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
      }),
    })

    this.formService.getMonths((new Date()).getMonth() + 1).subscribe(
      data => this.creditCardMonths = data
    );

    this.formService.getValidCreditCardYeards((new Date()).getFullYear()).subscribe(
      data => this.creditCardYears = data
    );

    this.showBill();

    this.populateCountryDropDown();
  }

  showBill() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    this.cartService.computeCartTotals();
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target instanceof HTMLInputElement)) {
      if (event.target.checked) {
        this.billingStates = this.shippingStates
        this.checkoutFormGroup.get('billingAddress')?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
      } else {
        this.checkoutFormGroup.get('billingAddress')?.reset();
        this.billingStates = [];
      }
    }
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    } else {
      // setup new order
      let order: Order = new Order();
      order.totalPrice = this.totalPrice;
      order.totalQuantity = this.totalQuantity;

      //get cartitems
      const cartItems: CartItem[] = this.cartService.cartItems;

      //create orderitems from cartitems
      let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem))

      //setup purchase
      let purchase: Purchase = new Purchase();

      //populate customer data for purchase
      purchase.customer = this.checkoutFormGroup.controls['customer'].value;

      //populate shippingAddress data for purchase
      purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

      //populate billingAddress data for purchase
      purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

      //populate order and order items for purchase
      purchase.order = order;
      purchase.orderItems = orderItems;

      //calling REST API 
      this.checkoutService.placeOrder(purchase).subscribe(
        {
          next: response => {
            alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
            // reset cart
            this.resetCart();
          },
          error: err => {
            alert(`There was an error: ${err.message}`);
          }
        }
      );

    }
  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form data
    this.checkoutFormGroup.reset();

    //navigate back to home page
    this.router.navigateByUrl('/products');
  }

  handleMonthYearRelation() {
    let month = 1;
    const creditCardForm = this.checkoutFormGroup.get('creditCardInfo');

    if (creditCardForm?.value.expirationYear == (new Date()).getFullYear()) {
      month = (new Date()).getMonth() + 1;
    }

    this.formService.getMonths(month).subscribe(
      data => this.creditCardMonths = data
    );
  }

  populateCountryDropDown() {
    this.formService.getCountries().subscribe(data => this.countries = data);
  }

  populateStateDropDown(formGroupName: string) {
    let countryCode: string = this.checkoutFormGroup.get(formGroupName)?.value.country

    this.formService.getStatesByCountryCode(countryCode).subscribe(
      data => {
        formGroupName == 'shippingAddress' ? this.shippingStates = data : this.billingStates = data;
        this.checkoutFormGroup.get(formGroupName)?.get('state')?.setValue(data[0].name)
        console.log(this.checkoutFormGroup.get(formGroupName)?.get('state')?.value)

      }
    );
  }
}
