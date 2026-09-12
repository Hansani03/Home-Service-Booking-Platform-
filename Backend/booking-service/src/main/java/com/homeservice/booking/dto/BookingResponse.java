package com.homeservice.booking.dto;

import com.homeservice.booking.model.BookingStatus;
import com.homeservice.booking.model.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Integer bookingId;
    private Integer customerId;
    private Integer providerId;
    private String providerName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String serviceAddress;
    private String description;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private BigDecimal totalAmount;
}
