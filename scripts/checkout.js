import { renderHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadBooks } from "../data/books-data.js";

const loadPage = async () => {
  try {
    await loadBooks();
  } 
  catch (error) {
    console.log(`Unexpected error. Please try again later!`);
  };
  
  renderHeader();
  renderOrderSummary();
  renderPaymentSummary();
};

loadPage();