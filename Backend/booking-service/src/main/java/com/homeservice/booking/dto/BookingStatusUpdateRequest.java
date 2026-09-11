package com.homeservice.booking.dto;

import com.homeservice.booking.model.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingStatusUpdateRequest {

    @NotNull
    private BookingStatus status;
}
