package com.homeservice.booking.repository;

import com.homeservice.booking.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByBookingId(Integer bookingId);
    Optional<Payment> findByTransactionReference(String transactionReference);
}
