package com.homeservice.booking.client;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderDto {
    private Integer providerId;
    private Integer categoryId;
    private String categoryName;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String location;
    private String availability;
    private Double rating;
}
