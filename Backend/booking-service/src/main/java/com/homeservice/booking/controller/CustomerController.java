package com.homeservice.booking.controller;

import com.homeservice.booking.dto.*;
import com.homeservice.booking.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<CustomerResponse> register(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<CustomerResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(customerService.login(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomer(@PathVariable Integer id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }
}
