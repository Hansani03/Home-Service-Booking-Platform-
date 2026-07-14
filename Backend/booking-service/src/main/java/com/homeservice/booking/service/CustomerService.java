package com.homeservice.booking.service;

import com.homeservice.booking.dto.CustomerRequest;
import com.homeservice.booking.dto.CustomerResponse;
import com.homeservice.booking.dto.LoginRequest;
import com.homeservice.booking.exception.ResourceNotFoundException;
import com.homeservice.booking.model.Customer;
import com.homeservice.booking.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional
    public CustomerResponse register(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Customer customer = Customer.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        return toResponse(customerRepository.save(customer));
    }

    public CustomerResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!customer.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return toResponse(customer);
    }

    public CustomerResponse getCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return toResponse(customer);
    }

    private CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .customerId(customer.getCustomerId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .build();
    }
}
