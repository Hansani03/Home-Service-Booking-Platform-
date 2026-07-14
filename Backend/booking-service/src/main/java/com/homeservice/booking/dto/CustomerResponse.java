package com.homeservice.booking.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {
    private Integer customerId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
}
