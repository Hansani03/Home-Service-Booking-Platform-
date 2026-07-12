package com.provider_service.provider.dto;

import com.provider_service.provider.model.Availability;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityUpdateRequest {

    @NotNull
    private Availability availability;
}
