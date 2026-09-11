package com.provider_service.provider.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provider_id")
    private Integer providerId;

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, length = 15)
    private String phone;

    @Column(length = 100)
    private String location;

    @Column(name = "experience_years")
    @Builder.Default
    private Integer experienceYears = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Availability availability = Availability.Available;

    @Column(precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
