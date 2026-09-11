-- Home Service Booking Platform - Provider Database
-- Import via phpMyAdmin or setup-databases.bat

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `homeservice_provider_db`;
USE `homeservice_provider_db`;

CREATE TABLE IF NOT EXISTS `service_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `providers` (
  `provider_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `availability` enum('Available','Busy','Offline') DEFAULT 'Available',
  `rating` decimal(2,1) DEFAULT 0.0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`provider_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `fk_provider_category` (`category_id`),
  CONSTRAINT `fk_provider_category` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `service_categories` (`category_name`, `description`) VALUES
('Electrician', 'Electrical repair and installation'),
('Plumber', 'Plumbing services'),
('Cleaner', 'Home cleaning services'),
('Painter', 'Painting and decoration'),
('Carpenter', 'Carpentry and woodwork');

INSERT INTO `providers` (`category_id`, `first_name`, `last_name`, `email`, `password`, `phone`, `location`, `experience_years`, `availability`, `rating`) VALUES
(1, 'John', 'Silva', 'john@gmail.com', '123456', '0771234567', 'Colombo', 5, 'Available', 4.5);

COMMIT;
