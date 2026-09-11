package com.provider_service.provider.controller;

import com.provider_service.provider.dto.*;
import com.provider_service.provider.model.ServiceCategory;
import com.provider_service.provider.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping("/categories")
    public ResponseEntity<List<ServiceCategory>> getAllCategories() {
        return ResponseEntity.ok(providerService.getAllCategories());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ServiceCategory> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(providerService.getCategoryById(id));
    }

    @GetMapping("/providers")
    public ResponseEntity<List<ProviderResponse>> getAllProviders() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }

    @GetMapping("/providers/available")
    public ResponseEntity<List<ProviderResponse>> getAvailableProviders() {
        return ResponseEntity.ok(providerService.getAvailableProviders());
    }

    @GetMapping("/providers/{id}")
    public ResponseEntity<ProviderResponse> getProviderById(@PathVariable Integer id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @GetMapping("/providers/category/{categoryId}")
    public ResponseEntity<List<ProviderResponse>> getProvidersByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(providerService.getProvidersByCategory(categoryId));
    }

    @GetMapping("/providers/{id}/exists")
    public ResponseEntity<Map<String, Boolean>> providerExists(@PathVariable Integer id) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", providerService.providerExists(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/providers")
    public ResponseEntity<ProviderResponse> registerProvider(@Valid @RequestBody ProviderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(providerService.registerProvider(request));
    }

    @PostMapping("/providers/login")
    public ResponseEntity<ProviderResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(providerService.login(request));
    }

    @PutMapping("/providers/{id}/availability")
    public ResponseEntity<ProviderResponse> updateAvailability(
            @PathVariable Integer id,
            @Valid @RequestBody AvailabilityUpdateRequest request) {
        return ResponseEntity.ok(providerService.updateAvailability(id, request));
    }
}
