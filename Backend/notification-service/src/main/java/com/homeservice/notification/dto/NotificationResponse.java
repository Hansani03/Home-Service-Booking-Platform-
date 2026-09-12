package com.homeservice.notification.dto;

import com.homeservice.notification.model.NotificationStatus;
import com.homeservice.notification.model.NotificationType;
import com.homeservice.notification.model.UserType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Integer notificationId;
    private Integer bookingId;
    private Integer userId;
    private UserType userType;
    private String title;
    private String message;
    private NotificationStatus status;
    private NotificationType notificationType;
    private LocalDateTime createdAt;
}
