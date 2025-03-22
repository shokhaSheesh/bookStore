import { cart } from '../../data/cart.js';

export const renderHeader = () => {
  let cartQuantity = 0;
  
  cart.cartItems.forEach(cartItem => {
    cartQuantity += cartItem.quantity;
  });

  if(cart.cartItems.length === 0) {
    cartQuantity = 0;
  };
  
  const html = `
    <div class="header-content">
      <div class="checkout-header-left-section">
        <a href="index.html" class="px24">BOOK STORE</a>
      </div>
  
      <div class="checkout-header-middle-section">
        Checkout (<a class="return-to-home-link"
        href="index.html">${cartQuantity} items</a>)
      </div>
  
      <div class="checkout-header-right-section">
        <i class="fa-solid fa-lock px18"></i>
      </div>
    </div>
  `;

  document.querySelector('.checkout-header').innerHTML = html;
};