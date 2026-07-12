package com.provider_service.provider.service;

import com.provider_service.provider.dto.*;
import com.provider_service.provider.exception.ResourceNotFoundException;
import com.provider_service.provider.model.Availability;
import com.provider_service.provider.model.Provider;
import com.provider_service.provider.model.ServiceCategory;
import com.provider_service.provider.repository.ProviderRepository;
import com.provider_service.provider.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ServiceCategoryRepository categoryRepository;

    public List<ServiceCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public ServiceCategory getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public List<ProviderResponse> getAllProviders() {
        return providerRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProviderResponse getProviderById(Integer id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        return toResponse(provider);
    }

    public List<ProviderResponse> getProvidersByCategory(Integer categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        return providerRepository.findByCategoryId(categoryId).stream().map(this::toResponse).toList();
    }

    public List<ProviderResponse> getAvailableProviders() {
        return providerRepository.findByAvailability(Availability.Available)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ProviderResponse registerProvider(ProviderRequest request) {
        if (providerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (request.getPhone() != null && providerRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number already registered");
        }
        if (!categoryRepository.existsById(request.getCategoryId())) {
            throw new ResourceNotFoundException("Category not found with id: " + request.getCategoryId());
        }

        Provider provider = Provider.builder()
                .categoryId(request.getCategoryId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .location(request.getLocation())
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 0)
                .availability(Availability.Available)
                .build();

        return toResponse(providerRepository.save(provider));
    }

    public ProviderResponse login(LoginRequest request) {
        Provider provider = providerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!provider.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return toResponse(provider);
    }

    @Transactional
    public ProviderResponse updateAvailability(Integer id, AvailabilityUpdateRequest request) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        provider.setAvailability(request.getAvailability());
        return toResponse(providerRepository.save(provider));
    }

    public boolean providerExists(Integer id) {
        return providerRepository.existsById(id);
    }

    private ProviderResponse toResponse(Provider provider) {
        String categoryName = categoryRepository.findById(provider.getCategoryId())
                .map(ServiceCategory::getCategoryName)
                .orElse(null);

        return ProviderResponse.builder()
                .providerId(provider.getProviderId())
                .categoryId(provider.getCategoryId())
                .categoryName(categoryName)
                .firstName(provider.getFirstName())
                .lastName(provider.getLastName())
                .email(provider.getEmail())
                .phone(provider.getPhone())
                .location(provider.getLocation())
                .experienceYears(provider.getExperienceYears())
                .availability(provider.getAvailability())
                .rating(provider.getRating())
                .build();
    }
}
