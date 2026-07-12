package com.provider_service.provider.repository;

import com.provider_service.provider.model.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Integer> {
    Optional<ServiceCategory> findByCategoryName(String categoryName);
}
