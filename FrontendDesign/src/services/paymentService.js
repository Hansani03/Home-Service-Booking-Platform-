// paymentService.js
// -----------------------------------------------------------------------------
// Fronts the "External Conceptual System: Payment Gateway" from the proposal.
// This is not one of the three microservices - it represents an external
// bank / payment processor the Booking Management Service (8081) would call
// out to via POST /api/payments before confirming a booking.
//
// Today this simulates that hand-off entirely on the client: it validates
// card input the way a gateway would, "calls out" with an artificial delay,
// and returns an approval/decline the same shape a real integration
// (e.g. Stripe, PayHere, WebXPay) would hand back.
// -----------------------------------------------------------------------------
import { delay } from './mockDb';

function luhnCheck(cardNumber) {
  const digits = cardNumber.replace(/\s+/g, '');
  if (!/^\d{12,19}$/.test(digits)) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(cardNumber) {
  const digits = cardNumber.replace(/\s+/g, '');
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  return 'Card';
}

export function validateCard({ cardNumber, cardHolder, expiry, cvv }) {
  const errors = {};
  const digits = (cardNumber || '').replace(/\s+/g, '');
  if (!cardHolder || cardHolder.trim().length < 2) errors.cardHolder = 'Enter the name on the card.';
  if (!digits || digits.length < 12) errors.cardNumber = 'Enter a valid card number.';
  else if (!luhnCheck(digits)) errors.cardNumber = 'This card number looks invalid.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry || '')) {
    errors.expiry = 'Use MM/YY format.';
  } else {
    const [mm, yy] = expiry.split('/').map(Number);
    const now = new Date();
    const expDate = new Date(2000 + yy, mm - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (expDate < thisMonth) errors.expiry = 'This card has expired.';
  }
  if (!/^\d{3,4}$/.test(cvv || '')) errors.cvv = 'Enter a valid CVV.';
  return errors;
}

export async function processPayment({ bookingId, amount, cardNumber, cardHolder, expiry, cvv }) {
  // TODO(API): POST http://localhost:8081/api/payments
  // { bookingId, amount, cardToken } - real integration would tokenize the
  // card client-side (never send raw PAN/CVV to your own server) and let the
  // gateway (Stripe/PayHere/etc.) handle the card data entirely.

  // Simulate the round-trip to the bank / payment processor.
  await delay(1400);

  const digits = cardNumber.replace(/\s+/g, '');
  // Simple deterministic "decline" rule for demoing failure states:
  // any card ending in 0000 is declined, everything else that passes
  // validation is approved.
  const declined = digits.endsWith('0000');

  if (declined) {
    return {
      status: 'Failed',
      bookingId,
      amount,
      transactionId: null,
      brand: detectCardBrand(digits),
      last4: digits.slice(-4),
      message: 'The bank declined this transaction. Please try a different card.',
      processedAt: new Date().toISOString(),
    };
  }

  return {
    status: 'Success',
    bookingId,
    amount,
    transactionId: `TXN-${Date.now().toString().slice(-8)}`,
    brand: detectCardBrand(digits),
    last4: digits.slice(-4),
    message: 'Payment approved.',
    processedAt: new Date().toISOString(),
  };
}
