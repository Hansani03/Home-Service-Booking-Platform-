import { apiRequest } from './api';

function luhnCheck(number) {
  const digits = number.replace(/\s+/g, '');
  if (!/^\d{12,19}$/.test(digits)) return false;
  let sum = 0; let alternate = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (alternate) { value *= 2; if (value > 9) value -= 9; }
    sum += value; alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(number) {
  const digits = number.replace(/\s+/g, '');
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  return 'Card';
}

export function validateCard({ cardNumber, cardHolder, expiry, cvv }) {
  const errors = {}; const digits = (cardNumber || '').replace(/\s+/g, '');
  if (!cardHolder || cardHolder.trim().length < 2) errors.cardHolder = 'Enter the name on the card.';
  if (!luhnCheck(digits)) errors.cardNumber = 'Enter a valid card number.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry || '')) errors.expiry = 'Use MM/YY format.';
  else {
    const [month, year] = expiry.split('/').map(Number);
    if (new Date(2000 + year, month, 0) < new Date()) errors.expiry = 'This card has expired.';
  }
  if (!/^\d{3,4}$/.test(cvv || '')) errors.cvv = 'Enter a valid CVV.';
  return errors;
}

export async function processPayment({ bookingId, amount, cardNumber }) {
  const response = await apiRequest('booking', '/payments', {
    method: 'POST', body: JSON.stringify({ bookingId: Number(bookingId), amount: Number(amount), paymentMethod: detectCardBrand(cardNumber) }),
  });
  const successful = response.paymentStatus === 'Success';
  return {
    status: successful ? 'Success' : 'Failed', bookingId: response.bookingId, amount: response.amount,
    transactionId: response.transactionReference, brand: response.paymentMethod,
    last4: cardNumber.replace(/\s+/g, '').slice(-4), message: successful ? 'Payment approved.' : 'Payment failed.',
  };
}
