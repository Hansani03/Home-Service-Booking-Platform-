package com.homeservice.booking.client;

import lombok.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class NotificationClient {

    private final WebClient notificationWebClient;

    public NotificationClient(@Qualifier("notificationWebClient") WebClient notificationWebClient) {
        this.notificationWebClient = notificationWebClient;
    }

    public void sendBookingNotification(Integer bookingId, Integer userId, String userType,
                                        String title, String message) {
        sendNotification(bookingId, userId, userType, title, message, "Booking");
    }

    public void sendPaymentNotification(Integer bookingId, Integer userId, String userType,
                                        String title, String message) {
        sendNotification(bookingId, userId, userType, title, message, "Payment");
    }

    private void sendNotification(Integer bookingId, Integer userId, String userType,
                                String title, String message, String notificationType) {
        NotificationPayload payload = NotificationPayload.builder()
                .bookingId(bookingId)
                .userId(userId)
                .userType(userType)
                .title(title)
                .message(message)
                .notificationType(notificationType)
                .build();

        try {
            notificationWebClient.post()
                    .uri("/api/notifications")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (Exception ignored) {
            // Notification failure should not block the main operation
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    static class NotificationPayload {
        private Integer bookingId;
        private Integer userId;
        private String userType;
        private String title;
        private String message;
        private String notificationType;
    }
}
