export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    deliveryFeeCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    deliveryFeeCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    deliveryFeeCents: 799
  }
];

export const getDeliveryOption = (deliveryOptionId) => {
  let deliveryOption;

  deliveryOptions.forEach(option => {
    if(deliveryOptionId === option.id) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOptions[0];
};