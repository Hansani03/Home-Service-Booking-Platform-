package com.homeservice.booking.repository;

import com.homeservice.booking.model.Booking;
import com.homeservice.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);
    List<Booking> findByProviderIdOrderByCreatedAtDesc(Integer providerId);
    List<Booking> findByStatus(BookingStatus status);
}
