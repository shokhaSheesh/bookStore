import { getBook, loadBooks, calculatePrice } from "../data/books-data.js";
import { cart } from "../data/cart.js";

async function loadPage() {
  await loadBooks();

  const url = new URL(window.location.href);
  const bookId = url.searchParams.get('bookId');

  const book = getBook(bookId);

  const bookHtml = `
    <div class="book-cover-container">
      <img src="${book.cover}">
    </div>

    <div class="book-details-container">
      <h1 class="book-title px32">${book.title}</h1>
      <h3 class="book-publisher px18">${book.publishedDate} by ${book.authors}</h3>
      <h3 class="book-category px18">Category: ${ book.category}</h3>
      <span class="book-pages px18">${book.pageCount} pages</span>
      <p class="book-description px16">${book.description}</p>
      <h3 class="book-price px24">$${calculatePrice(book.priceCents)}</h3>
      <span class="added-msg added-msg-${bookId} px18 bold">Added To Cart</span>
      <button class="add-to-cart-btn px18"
        data-book-id=${bookId}>
        Add To Cart
      </button>
    </div> 
  `;

  document.querySelector('.book-container').innerHTML = bookHtml;

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

  document.querySelector('.add-to-cart-btn').addEventListener('click', (event) => {
    const bookId = event.target.dataset.bookId;
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
  });
};
loadPage();