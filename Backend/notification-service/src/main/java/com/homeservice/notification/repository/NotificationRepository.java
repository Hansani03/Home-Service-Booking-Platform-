package com.homeservice.notification.repository;

import com.homeservice.notification.model.Notification;
import com.homeservice.notification.model.NotificationStatus;
import com.homeservice.notification.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserIdAndUserTypeOrderByCreatedAtDesc(Integer userId, UserType userType);
    List<Notification> findByUserIdAndUserTypeAndStatus(Integer userId, UserType userType, NotificationStatus status);
    List<Notification> findByBookingId(Integer bookingId);
}
