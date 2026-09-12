import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import * as paymentService from '../../services/paymentService';

export default function PaymentGateway() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [stage, setStage] = useState('form'); // form | processing | result
  const [result, setResult] = useState(null);

  useEffect(() => {
    bookingService.getBookingById(bookingId).then((b) => {
      setBooking(b);
      setLoading(false);
    });
  }, [bookingId]);

  function update(field, value) {
    let v = value;
    if (field === 'cardNumber') {
      v = value.replace(/[^\d]/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'expiry') {
      v = value.replace(/[^\d]/g, '').slice(0, 4);
      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    } else if (field === 'cvv') {
      v = value.replace(/[^\d]/g, '').slice(0, 4);
    }
    setForm((f) => ({ ...f, [field]: v }));
  }

  async function handlePay(e) {
    e.preventDefault();
    const validationErrors = paymentService.validateCard(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStage('processing');
    try {
      const paymentResult = await paymentService.processPayment({
        bookingId: booking.id,
        amount: booking.totalAmount,
        ...form,
      });
      await bookingService.recordPayment(booking.id, paymentResult);
      setResult(paymentResult);
      setStage('result');
    } catch {
      setResult({ status: 'Failed', message: 'A network error occurred. Please try again.' });
      setStage('result');
    }
  }

  const brand = paymentService.detectCardBrand(form.cardNumber);

  if (loading) {
    return (
      <div className="hf-bank-shell d-flex align-items-center justify-content-center">
        <div className="spinner-border" style={{ color: 'var(--hf-green-800)' }} role="status" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="hf-bank-shell d-flex align-items-center justify-content-center">
        <p className="text-muted">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="hf-bank-shell">
      <div className="hf-bank-header py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock-fill fs-4" style={{ color: 'var(--hf-gold-500)' }} />
            <div>
              <div className="fw-bold">Ceylon National Payment Gateway</div>
              <div className="small" style={{ opacity: 0.7 }}>
                Secure external payment processor &middot; conceptual integration
              </div>
            </div>
          </div>
          <span className="badge bg-success bg-opacity-25 text-success border border-success">
            <i className="bi bi-lock-fill me-1" />
            256-bit SSL
          </span>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: 920 }}>
        <div className="row g-4">
          <div className="col-md-5">
            <div className="hf-card-preview mb-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="chip" />
                <span className="fw-bold">{brand}</span>
              </div>
              <div className="hf-card-number-mono mt-4">{form.cardNumber || '•••• •••• •••• ••••'}</div>
              <div className="d-flex justify-content-between mt-3" style={{ fontSize: '0.85rem' }}>
                <div>
                  <div style={{ opacity: 0.65, fontSize: '0.65rem' }}>CARD HOLDER</div>
                  {form.cardHolder || 'YOUR NAME'}
                </div>
                <div>
                  <div style={{ opacity: 0.65, fontSize: '0.65rem' }}>EXPIRES</div>
                  {form.expiry || 'MM/YY'}
                </div>
              </div>
            </div>

            <div className="hf-card p-3">
              <div className="d-flex justify-content-between small text-muted">
                <span>Booking</span>
                <span className="fw-bold text-dark">BK-{booking.id}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mt-1">
                <span>Merchant</span>
                <span className="fw-bold text-dark">HomeFixr Services</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Amount Payable</span>
                <span className="fw-bold fs-5" style={{ color: 'var(--hf-green-900)' }}>
                  Rs. {booking.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="hf-card p-4">
              {stage === 'form' && (
                <>
                  <h5 className="mb-3">Card Details</h5>
                  <form onSubmit={handlePay} noValidate>
                    <div className="mb-3">
                      <label className="form-label small">Card Number</label>
                      <input
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        placeholder="4242 4242 4242 4242"
                        value={form.cardNumber}
                        onChange={(e) => update('cardNumber', e.target.value)}
                      />
                      {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Cardholder Name</label>
                      <input
                        className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                        placeholder="As shown on card"
                        value={form.cardHolder}
                        onChange={(e) => update('cardHolder', e.target.value)}
                      />
                      {errors.cardHolder && <div className="invalid-feedback">{errors.cardHolder}</div>}
                    </div>
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <label className="form-label small">Expiry (MM/YY)</label>
                        <input
                          className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                          placeholder="MM/YY"
                          value={form.expiry}
                          onChange={(e) => update('expiry', e.target.value)}
                        />
                        {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                      </div>
                      <div className="col-6">
                        <label className="form-label small">CVV</label>
                        <input
                          className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                          placeholder="123"
                          value={form.cvv}
                          onChange={(e) => update('cvv', e.target.value)}
                        />
                        {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                      </div>
                    </div>
                    <button className="btn btn-hf-primary w-100" type="submit">
                      Pay Rs. {booking.totalAmount.toLocaleString()}
                    </button>
                    <p className="text-muted text-center small mt-3 mb-0">
                      This is a simulated payment gateway for demo purposes. No real transaction takes place.
                      <br />
                      Tip: a card ending in <strong>0000</strong> will be declined.
                    </p>
                  </form>
                </>
              )}

              {stage === 'processing' && (
                <div className="text-center py-5">
                  <div className="spinner-border mb-3" style={{ color: 'var(--hf-green-800)' }} role="status" />
                  <h6>Contacting your bank…</h6>
                  <p className="text-muted small">Please do not close this window.</p>
                </div>
              )}

              {stage === 'result' && result && (
                <div className="text-center py-4">
                  {result.status === 'Success' ? (
                    <>
                      <i className="bi bi-check-circle-fill fs-1" style={{ color: 'var(--hf-green-800)' }} />
                      <h5 className="mt-3">Payment Approved</h5>
                      <p className="text-muted">
                        Transaction {result.transactionId} &middot; {result.brand} ending in {result.last4}
                      </p>
                      <button className="btn btn-hf-primary mt-2" onClick={() => navigate('/customer/bookings')}>
                        View My Bookings
                      </button>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle-fill fs-1 text-danger" />
                      <h5 className="mt-3">Payment Declined</h5>
                      <p className="text-muted">{result.message}</p>
                      <button className="btn btn-hf-primary mt-2" onClick={() => { setStage('form'); setResult(null); }}>
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
