package com.homeservice.notification.controller;

import com.homeservice.notification.dto.NotificationRequest;
import com.homeservice.notification.dto.NotificationResponse;
import com.homeservice.notification.model.UserType;
import com.homeservice.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotification(@PathVariable Integer id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(
            @PathVariable Integer userId,
            @RequestParam UserType userType) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId, userType));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @PathVariable Integer userId,
            @RequestParam UserType userType) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId, userType));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<NotificationResponse>> getBookingNotifications(@PathVariable Integer bookingId) {
        return ResponseEntity.ok(notificationService.getNotificationsByBooking(bookingId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Integer id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
