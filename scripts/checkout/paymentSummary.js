import { cart } from '../../data/cart.js';
import {getBook, calculatePrice} from "../../data/books-data.js";
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { orderDetails, saveToCartStorage } from '../../data/orders-data.js';

export const renderPaymentSummary = () => {
  let productPriceCents = 0;
  let shippingCents = 0;
  
  cart.cartItems.forEach(cartItem => {
    const bookId = cartItem.id;
    const book = getBook(bookId);

    productPriceCents += Number(book.priceCents) * Number(cartItem.quantity);

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingCents = deliveryOption.deliveryFeeCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const html = `
    <div class="payment-summary-title px18 bold">
        Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${calculateQuantity()}):</div>
      <div class="payment-summary-money">$${calculatePrice(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${calculatePrice(shippingCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${calculatePrice(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${calculatePrice(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row px18 bold">
      <div>Order total:</div>
      <div class="payment-summary-money">$${calculatePrice(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.payment-summary').innerHTML = html;

  function calculateQuantity () {
    let cartQuantity = 0;

    cart.cartItems.forEach(cartItem => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  };

  const generateOrderId = () => {
    return "xxxx-xxxx-xxxx".replace(/[x]/g, () =>
      Math.random().toString(36).charAt(2)
    );
  };
  

  document.querySelector('.place-order-button').addEventListener('click', () => {
    const orderId = generateOrderId();
    const orderTime = new Date();

    const orderedTime = orderTime.toLocaleString("en-US", {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });

    orderDetails.push({
      orderId,
      orderedTime,
      orderTotalCents: totalCents,
      items: [...cart.cartItems]
    });
    saveToCartStorage();

    cart.cartItems = [];
    cart.saveToStorage();
    window.location.href = 'orders.html';
  });
};