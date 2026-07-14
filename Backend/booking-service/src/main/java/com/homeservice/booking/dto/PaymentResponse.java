package com.homeservice.booking.dto;

import com.homeservice.booking.model.TransactionStatus;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Integer paymentId;
    private Integer bookingId;
    private String paymentMethod;
    private BigDecimal amount;
    private TransactionStatus paymentStatus;
    private String transactionReference;
}
