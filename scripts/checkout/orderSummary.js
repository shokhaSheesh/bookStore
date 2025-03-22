import { cart } from "../../data/cart.js";
import { getBook, calculatePrice } from "../../data/books-data.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import {renderPaymentSummary} from './paymentSummary.js'
import { renderHeader } from "./checkoutHeader.js";


export const renderOrderSummary = () => {
  let orderSummaryHtml = ``;

  cart.cartItems.forEach(cartItem => {
    const bookId = cartItem.id;
    const book = getBook(bookId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = getDeliveryOption(deliveryOptionId);
    const dateString = calculateDeliveryDays(deliveryOption);

    orderSummaryHtml += `
      <div class="cart-item-container
        js-cart-item-container-${book.id}">
        <div class="delivery-date px18 bold">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${book.cover}">

          <div class="cart-item-details">
            <div class="product-name bold">
              ${book.title}
            </div>
            <div class="product-price bold">
              $${calculatePrice(book.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary"
                data-book-id="${book.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${book.id}">
              <span class="save-quantity-link link-primary js-save-link"
                data-book-id="${book.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary"
                data-book-id="${book.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title bold">
              Choose a delivery option:
            </div>
            ${deliveryOptionHtml(book, cartItem)}  
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionHtml (book, cartItem) {
    let html = ``;

    deliveryOptions.forEach(deliveryOption => {
      const dateString = calculateDeliveryDays(deliveryOption);
      const priceString = deliveryOption.deliveryFeeCents === 0 ? 'FREE' : `$${calculatePrice(deliveryOption.deliveryFeeCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option"
          data-book-id="${book.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${book.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} - Shipping
            </div>
          </div>
        </div>
      `;
    });

    return html;
  };

  document.querySelector('.order-summary').innerHTML = orderSummaryHtml;
  
  function calculateDeliveryDays (deliveryOption) {
    const today = new Date();
    let deliveryDate = new Date(today);
    let workingDays = 0;
  
    while(workingDays < deliveryOption.deliveryDays) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      const dayOfWeek = deliveryDate.getDay();
  
      if(dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }
  
    return deliveryDate.toLocaleDateString("en-US", { 
      weekday: "long", month: "long", day: "numeric" 
    });
  };

  document.querySelectorAll('.delivery-option').forEach(element => {
    element.addEventListener('click', () => {
      const {bookId, deliveryOptionId} = element.dataset;
      cart.updateDeliveryOption(bookId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  });

  document.querySelectorAll('.delete-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
      const bookId = link.dataset.bookId;
      cart.removeFromCart(bookId);
      renderOrderSummary();
      renderPaymentSummary();
      renderHeader();
    })
  });

  document.querySelectorAll('.update-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
      const bookId = link.dataset.bookId;
      const container = document.querySelector(`.js-cart-item-container-${bookId}`);

      container.classList.add('is-editing-quantity');
    })
  });

  document.querySelectorAll('.save-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
      const bookId = link.dataset.bookId;
      const container = document.querySelector(`.js-cart-item-container-${bookId}`);

      container.classList.remove('is-editing-quantity');

      const input = document.querySelector(`.js-quantity-input-${bookId}`);
      const newQuantity = Number(input.value);
      cart.updateQuantity(bookId, newQuantity);

      renderHeader();
      renderOrderSummary();
      renderPaymentSummary();
    })
  });
};