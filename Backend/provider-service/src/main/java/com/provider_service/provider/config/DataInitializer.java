package com.provider_service.provider.config;

import com.provider_service.provider.model.Availability;
import com.provider_service.provider.model.Provider;
import com.provider_service.provider.model.ServiceCategory;
import com.provider_service.provider.repository.ProviderRepository;
import com.provider_service.provider.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ServiceCategoryRepository categoryRepository;
    private final ProviderRepository providerRepository;

    private static final List<String[]> DEFAULT_CATEGORIES = List.of(
            new String[]{"Electrician", "Electrical repair and installation"},
            new String[]{"Plumber", "Plumbing services"},
            new String[]{"Cleaner", "Home cleaning services"},
            new String[]{"Painter", "Painting and decoration"},
            new String[]{"Carpenter", "Carpentry and woodwork"}
    );

    @Override
    public void run(String... args) {
        try {
            seedCategories();
            seedDefaultProvider();
        } catch (Exception ex) {
            log.warn("Seed data skipped. Service will still run. Reason: {}", ex.getMessage());
        }
    }

    private void seedCategories() {
        for (String[] category : DEFAULT_CATEGORIES) {
            if (categoryRepository.findByCategoryName(category[0]).isEmpty()) {
                categoryRepository.save(ServiceCategory.builder()
                        .categoryName(category[0])
                        .description(category[1])
                        .build());
            }
        }
    }

    private void seedDefaultProvider() {
        if (providerRepository.findByEmail("john@gmail.com").isPresent()) {
            return;
        }

        Integer categoryId = categoryRepository.findByCategoryName("Electrician")
                .map(ServiceCategory::getCategoryId)
                .orElse(1);

        providerRepository.save(Provider.builder()
                .categoryId(categoryId)
                .firstName("John")
                .lastName("Silva")
                .email("john@gmail.com")
                .password("123456")
                .phone("0771234567")
                .location("Colombo")
                .experienceYears(5)
                .availability(Availability.Available)
                .rating(new BigDecimal("4.5"))
                .build());
    }
}
