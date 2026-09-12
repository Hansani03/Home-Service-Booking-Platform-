package com.homeservice.notification.dto;

import com.homeservice.notification.model.NotificationType;
import com.homeservice.notification.model.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {

    private Integer bookingId;

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "User type is required")
    private UserType userType;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Notification type is required")
    private NotificationType notificationType;
}
