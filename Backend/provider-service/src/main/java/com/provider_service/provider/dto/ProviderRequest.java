package com.provider_service.provider.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderRequest {

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @NotBlank(message = "First name is required")
    @Size(max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 255)
    private String password;

    @Size(max = 15)
    private String phone;

    @Size(max = 100)
    private String location;

    @Min(0)
    private Integer experienceYears;
}
