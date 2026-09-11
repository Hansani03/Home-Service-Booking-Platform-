package com.homeservice.notification.service;

import com.homeservice.notification.dto.NotificationRequest;
import com.homeservice.notification.dto.NotificationResponse;
import com.homeservice.notification.exception.ResourceNotFoundException;
import com.homeservice.notification.model.Notification;
import com.homeservice.notification.model.NotificationStatus;
import com.homeservice.notification.model.UserType;
import com.homeservice.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .bookingId(request.getBookingId())
                .userId(request.getUserId())
                .userType(request.getUserType())
                .title(request.getTitle())
                .message(request.getMessage())
                .notificationType(request.getNotificationType())
                .status(NotificationStatus.Unread)
                .build();

        return toResponse(notificationRepository.save(notification));
    }

    public NotificationResponse getNotificationById(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        return toResponse(notification);
    }

    public List<NotificationResponse> getNotificationsByUser(Integer userId, UserType userType) {
        return notificationRepository.findByUserIdAndUserTypeOrderByCreatedAtDesc(userId, userType)
                .stream().map(this::toResponse).toList();
    }

    public List<NotificationResponse> getUnreadNotifications(Integer userId, UserType userType) {
        return notificationRepository.findByUserIdAndUserTypeAndStatus(userId, userType, NotificationStatus.Unread)
                .stream().map(this::toResponse).toList();
    }

    public List<NotificationResponse> getNotificationsByBooking(Integer bookingId) {
        return notificationRepository.findByBookingId(bookingId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setStatus(NotificationStatus.Read);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public List<NotificationResponse> markAllAsRead(Integer userId, UserType userType) {
        List<Notification> notifications = notificationRepository.findByUserIdAndUserTypeOrderByCreatedAtDesc(userId, userType);
        notifications.forEach(notification -> notification.setStatus(NotificationStatus.Read));
        return notificationRepository.saveAll(notifications).stream().map(this::toResponse).toList();
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .bookingId(notification.getBookingId())
                .userId(notification.getUserId())
                .userType(notification.getUserType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .status(notification.getStatus())
                .notificationType(notification.getNotificationType())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
