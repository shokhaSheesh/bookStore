import { getOrder } from "../data/orders-data.js";
import { getBook, loadBooks } from "../data/books-data.js";
import { cart } from "../data/cart.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";

async function loadPage() {
  await loadBooks();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const bookId = url.searchParams.get('bookId');

  const order = getOrder(orderId);
  const book = getBook(bookId);

  let bookDetails;
  let deliveryOption;

  order.items.forEach(details => {
    if (details.id === book.id) {
      bookDetails = details;
      deliveryOption = getDeliveryOption(details.deliveryOptionId);
    }
  });

  const orderedTime = new Date(order.orderedTime);
  const deliveryTime = calculateDeliveryDate(orderedTime, deliveryOption);
  const today = new Date();

  const deliveredMsg = today.getTime() > deliveryTime.getTime() ? "Delivered On" : "Arriving on";
  const percentProgress = Math.min(
    100,
    Math.max(0, ((today.valueOf() - orderedTime.valueOf()) / (deliveryTime.valueOf() - orderedTime.valueOf())) * 100)
  ) * 100; 

  console.log(orderedTime);
  console.log(deliveryTime);

  const formattedDate = deliveryTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  console.log(percentProgress);

  const trackingHtml = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
      ${deliveredMsg} ${formattedDate}
    </div>
    <div class="product-info">
      ${book.title}
    </div>
    <div class="product-info">
      Quantity: ${bookDetails.quantity}
    </div>
    <img class="product-image" src="${book.cover}">
    <div class="progress-labels-container">
      <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${percentProgress >= 100 ? 'current-status' : ''}">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  document.querySelector('.order-tracking').innerHTML = trackingHtml;

  function updateCartQuantity() {
    let cartQuantity = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-quantity').innerHTML = cartQuantity;
  }

  updateCartQuantity();

  function calculateDeliveryDate(startDate, deliveryOption) {
    let deliveryDate = new Date(startDate);
    let workingDays = 0;
  
    
    while (workingDays < deliveryOption.deliveryDays) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      const dayOfWeek = deliveryDate.getDay(); 

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }
  
    return deliveryDate;
  }
  
}

loadPage();
