import { cart } from "./cart.js";

export const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || []

export function saveToCartStorage () {
  localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
};

export const getOrder = (orderId) => {
  let matchingOrder = orderDetails.find(order => order.orderId === orderId);
  return matchingOrder;
}