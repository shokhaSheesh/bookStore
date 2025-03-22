import { cart } from "../data/cart.js";
import { orderDetails } from "../data/orders-data.js";
import { loadBooks, calculatePrice, getBook } from "../data/books-data.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";

async function loadPage() {
  await loadBooks();

  let ordersHtml = ``;

  orderDetails.forEach(orderDetail => {
    const orderedTime = new Date(orderDetail.orderedTime);

    const orderTimeString = orderedTime.toLocaleDateString("en-US", {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const orderItems = orderDetail.items;

    let orderItemsHtml = ``;
    orderItems.forEach(item => {
      const itemId = item.id;
      const book = getBook(itemId);

      console.log(`Order Detail: ${orderDetail}`);
      console.log(`Order Items: ${orderItems}`);
      console.log(`Book: ${book}`);
      console.log(`Item: ${item}`);
      console.log(`Item Id: ${item.id}`);
      console.log(getBook(itemId));

      const deliveryOption = getDeliveryOption(item.deliveryOptionId);

      orderItemsHtml += `
        <div class="product-image-container">
          <img src="${book.cover}">
        </div>
        <div class="product-details">
          <div class="product-name">
            ${book.title}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${
              calculateDeliveryDays(deliveryOption)
            }
          </div>
          <div class="product-quantity">
            Quantity: ${item.quantity}
          </div>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${orderDetail.orderId}&bookId=${book.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHtml += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${calculatePrice(orderDetail.orderTotalCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderDetail.orderId}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${orderItemsHtml} 
        </div>
      </div>
    `;
  });

  document.querySelector('.orders-grid').innerHTML = ordersHtml;

  const updateCartQuantity = () => {
    let cartQuantity = 0;

    cart.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    document.querySelector('.cart-quantity').innerHTML = cartQuantity;
  };
  updateCartQuantity();

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
}

loadPage();
