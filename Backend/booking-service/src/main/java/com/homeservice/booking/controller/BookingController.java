package com.homeservice.booking.controller;

import com.homeservice.booking.dto.*;
import com.homeservice.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Integer customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(customerId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(@PathVariable Integer providerId) {
        return ResponseEntity.ok(bookingService.getBookingsByProvider(providerId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }
}
