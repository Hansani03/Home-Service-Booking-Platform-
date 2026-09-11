package com.homeservice.booking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Value("${provider.service.url}")
    private String providerServiceUrl;

    @Value("${notification.service.url}")
    private String notificationServiceUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Bean
    public WebClient providerWebClient() {
        return WebClient.builder().baseUrl(providerServiceUrl).build();
    }

    @Bean
    public WebClient notificationWebClient() {
        return WebClient.builder().baseUrl(notificationServiceUrl).build();
    }
}
