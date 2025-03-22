import { books, loadBooks, getBook, calculatePrice } from "../data/books-data.js";
import { cart } from "../data/cart.js";

loadBooks().then(() => {
  renderBooks();
});

function renderBooks () {
  let booksHtml = ``;
  books
  .filter((_, index) => index !== 20)
  .forEach(book => {
    booksHtml += `
    <div class="book">
      <div class="book-img">
        <img src="${book.cover}">
      </div>
      <div class="book-description-container">
        <a href="book.html?bookId=${book.id}" class="book-title px16 bold">${book.title.length > 35 ? book.title.slice(0, 35) + '...' : book.title}</a>
        <span class="book-author px14">By ${book.authors[0]}</span>
      </div>
      <span class="book-price px16 bold">$${calculatePrice(book.priceCents)}</span>
      <span class="added-msg px16 bold added-msg-${book.id}"}>Added</span>
      <button class="add-to-cart" data-add-btn="${book.id}">Add To Cart</button>
    </div>`
  });

  document.querySelector('.books-container').innerHTML = booksHtml;

  
  // UPDATE CART QUANTITY
  const updateCartQuantity = () => {
    let cartQuantity = 0;

    cart.cartItems.forEach(cartItem => {
      cartQuantity += cartItem.quantity;
    });

    if(cart.cartItems.length === 0) {
      cartQuantity = 0;
    };

    document.querySelector('.cart-quantity').innerHTML = cartQuantity; 
  };

  updateCartQuantity();

  const addedMsgTimeOut = {};

  // ADD TO CART BTN
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.dataset.addBtn;
      cart.addToCart(bookId);

      const addedMsg = document.querySelector(`.added-msg-${bookId}`);

      const previousTimeOutId = addedMsgTimeOut[bookId];

      if(previousTimeOutId) {
        clearTimeout(previousTimeOutId);
      };

      addedMsg.style.opacity = 100;

      const timeOutId = setTimeout(() =>{
        addedMsg.style.opacity = 0;
      }, 2000);
      
      addedMsgTimeOut[bookId] = timeOutId;
      
      updateCartQuantity();
    })
  });
};