package com.provider_service.provider.dto;

import com.provider_service.provider.model.Availability;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderResponse {
    private Integer providerId;
    private Integer categoryId;
    private String categoryName;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String location;
    private Integer experienceYears;
    private Availability availability;
    private BigDecimal rating;
}
