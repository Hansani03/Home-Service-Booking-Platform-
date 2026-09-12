package com.provider_service.provider.repository;

import com.provider_service.provider.model.Provider;
import com.provider_service.provider.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Integer> {
    List<Provider> findByCategoryId(Integer categoryId);
    List<Provider> findByAvailability(Availability availability);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<Provider> findByEmail(String email);
}
