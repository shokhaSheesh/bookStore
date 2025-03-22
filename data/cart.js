class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  };

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart (bookId) {
    let matchingBook = this.cartItems.find(cartItem => cartItem.id === bookId);

    if(matchingBook) {
      matchingBook.quantity += 1;
    }
    else {
      this.cartItems.push(
        {
          id: bookId,
          quantity: 1,
          deliveryOptionId: '1'
        }
      );
    };
    this.saveToStorage();
  }

  removeFromCart (bookId) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== bookId);

    this.saveToStorage();
  };

  updateDeliveryOption (bookId, deliveryOptionId) {
    let matchingBook = this.cartItems.find(cartItem => cartItem.id === bookId);

    matchingBook.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  };

  updateQuantity(bookId, newQuantity) {
    let matchingBook = this.cartItems.find(cartItem => cartItem.id === bookId);

    matchingBook.quantity = newQuantity;

    this.saveToStorage();
  }
};

export const cart = new Cart('books-cart');