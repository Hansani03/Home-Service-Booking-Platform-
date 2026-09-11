-- Home Service Booking Platform - Notification Database
-- Import via phpMyAdmin or setup-databases.bat

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `homeservice_notification_db`;
USE `homeservice_notification_db`;

CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('Customer','Provider') DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('Unread','Read') DEFAULT 'Unread',
  `notification_type` enum('Booking','Payment','Reminder') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
