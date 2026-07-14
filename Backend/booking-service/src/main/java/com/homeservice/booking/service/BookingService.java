package com.homeservice.booking.service;

import com.homeservice.booking.client.NotificationClient;
import com.homeservice.booking.client.ProviderClient;
import com.homeservice.booking.client.ProviderDto;
import com.homeservice.booking.dto.*;
import com.homeservice.booking.exception.ResourceNotFoundException;
import com.homeservice.booking.model.Booking;
import com.homeservice.booking.model.BookingStatus;
import com.homeservice.booking.model.PaymentStatus;
import com.homeservice.booking.repository.BookingRepository;
import com.homeservice.booking.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ProviderClient providerClient;
    private final NotificationClient notificationClient;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        if (!customerRepository.existsById(request.getCustomerId())) {
            throw new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId());
        }

        ProviderDto provider = providerClient.getProviderById(request.getProviderId());
        if (provider == null) {
            throw new ResourceNotFoundException("Provider not found with id: " + request.getProviderId());
        }

        if (!"Available".equals(provider.getAvailability())) {
            throw new IllegalArgumentException("Provider is not available for booking");
        }

        Booking booking = Booking.builder()
                .customerId(request.getCustomerId())
                .providerId(request.getProviderId())
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .serviceAddress(request.getServiceAddress())
                .description(request.getDescription())
                .totalAmount(request.getTotalAmount())
                .status(BookingStatus.Pending)
                .paymentStatus(PaymentStatus.Pending)
                .build();

        Booking saved = bookingRepository.save(booking);
        BookingResponse response = toResponse(saved, provider);

        notificationClient.sendBookingNotification(
                saved.getBookingId(),
                saved.getCustomerId(),
                "Customer",
                "Booking Created",
                "Your booking #" + saved.getBookingId() + " has been created and is pending approval."
        );

        notificationClient.sendBookingNotification(
                saved.getBookingId(),
                saved.getProviderId(),
                "Provider",
                "New Booking Request",
                "You have a new booking request #" + saved.getBookingId() + " from a customer."
        );

        return response;
    }

    public BookingResponse getBookingById(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        ProviderDto provider = providerClient.getProviderById(booking.getProviderId());
        return toResponse(booking, provider);
    }

    public List<BookingResponse> getBookingsByCustomer(Integer customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with id: " + customerId);
        }
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(booking -> toResponse(booking, providerClient.getProviderById(booking.getProviderId())))
                .toList();
    }

    public List<BookingResponse> getBookingsByProvider(Integer providerId) {
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId)
                .stream()
                .map(booking -> toResponse(booking, providerClient.getProviderById(booking.getProviderId())))
                .toList();
    }

    @Transactional
    public BookingResponse updateBookingStatus(Integer id, BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(request.getStatus());
        Booking saved = bookingRepository.save(booking);
        ProviderDto provider = providerClient.getProviderById(saved.getProviderId());

        notificationClient.sendBookingNotification(
                saved.getBookingId(),
                saved.getCustomerId(),
                "Customer",
                "Booking Status Updated",
                "Your booking #" + saved.getBookingId() + " status is now: " + request.getStatus()
        );

        return toResponse(saved, provider);
    }

    private BookingResponse toResponse(Booking booking, ProviderDto provider) {
        String providerName = provider != null
                ? provider.getFirstName() + " " + provider.getLastName()
                : "Unknown Provider";

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .customerId(booking.getCustomerId())
                .providerId(booking.getProviderId())
                .providerName(providerName)
                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .serviceAddress(booking.getServiceAddress())
                .description(booking.getDescription())
                .status(booking.getStatus())
                .paymentStatus(booking.getPaymentStatus())
                .totalAmount(booking.getTotalAmount())
                .build();
    }
}
