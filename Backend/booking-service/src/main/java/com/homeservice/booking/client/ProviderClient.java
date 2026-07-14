package com.homeservice.booking.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
public class ProviderClient {

    private final WebClient providerWebClient;

    public ProviderClient(@Qualifier("providerWebClient") WebClient providerWebClient) {
        this.providerWebClient = providerWebClient;
    }

    public ProviderDto getProviderById(Integer providerId) {
        try {
            return providerWebClient.get()
                    .uri("/api/providers/{id}", providerId)
                    .retrieve()
                    .bodyToMono(ProviderDto.class)
                    .block();
        } catch (WebClientResponseException.NotFound e) {
            return null;
        }
    }

    public boolean providerExists(Integer providerId) {
        return getProviderById(providerId) != null;
    }
}
