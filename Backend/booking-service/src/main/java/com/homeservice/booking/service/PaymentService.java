package com.homeservice.booking.service;

import com.homeservice.booking.client.NotificationClient;
import com.homeservice.booking.dto.PaymentRequest;
import com.homeservice.booking.dto.PaymentResponse;
import com.homeservice.booking.exception.ResourceNotFoundException;
import com.homeservice.booking.model.Booking;
import com.homeservice.booking.model.Payment;
import com.homeservice.booking.model.PaymentStatus;
import com.homeservice.booking.model.TransactionStatus;
import com.homeservice.booking.repository.BookingRepository;
import com.homeservice.booking.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final NotificationClient notificationClient;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (booking.getPaymentStatus() == PaymentStatus.Paid) {
            throw new IllegalArgumentException("Booking is already paid");
        }

        Payment payment = Payment.builder()
                .bookingId(request.getBookingId())
                .paymentMethod(request.getPaymentMethod())
                .amount(request.getAmount())
                .paymentStatus(TransactionStatus.Success)
                .transactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        Payment saved = paymentRepository.save(payment);

        booking.setPaymentStatus(PaymentStatus.Paid);
        bookingRepository.save(booking);

        notificationClient.sendPaymentNotification(
                booking.getBookingId(),
                booking.getCustomerId(),
                "Customer",
                "Payment Successful",
                "Payment of " + request.getAmount() + " for booking #" + booking.getBookingId() + " was successful."
        );

        return toResponse(saved);
    }

    public PaymentResponse getPaymentById(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return toResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByBooking(Integer bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new ResourceNotFoundException("Booking not found with id: " + bookingId);
        }
        return paymentRepository.findByBookingId(bookingId).stream().map(this::toResponse).toList();
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(payment.getBookingId())
                .paymentMethod(payment.getPaymentMethod())
                .amount(payment.getAmount())
                .paymentStatus(payment.getPaymentStatus())
                .transactionReference(payment.getTransactionReference())
                .build();
    }
}
