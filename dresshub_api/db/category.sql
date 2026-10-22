-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 04, 2024 at 01:35 PM
-- Server version: 10.6.20-MariaDB-cll-lve
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `groctnfb_grocji`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` varchar(10) NOT NULL,
  `categoryname` varchar(100) NOT NULL,
  `categoryimage` varchar(200) NOT NULL,
  `isactive` int(10) NOT NULL DEFAULT 1,
  `createdon` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdby` varchar(20) NOT NULL DEFAULT 'admin',
  `updatedon` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedby` varchar(20) NOT NULL DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `categoryname`, `categoryimage`, `isactive`, `createdon`, `createdby`, `updatedon`, `updatedby`) VALUES
('attar23346', 'Rice, Dal, Atta & Oil', '', 1, '2024-07-18 17:05:00', 'admin', '2024-08-10 13:44:49', 'admin'),
('babyc42146', 'Baby Food & Care', '', 1, '2024-07-19 11:32:08', 'admin', '2024-08-10 13:45:03', 'admin'),
('bath,26350', 'Bath, Body & Hair', '', 1, '2024-07-19 11:29:47', 'admin', '2024-07-19 11:29:47', 'admin'),
('biscu15589', 'Biscuits & Snacks', '', 1, '2024-07-18 17:07:48', 'admin', '2024-08-10 13:41:00', 'admin'),
('break52600', ' Breakfast & Sauces', '', 0, '2024-07-18 17:07:22', 'admin', '2024-08-10 13:41:22', 'admin'),
('clean10142', 'Cleaning Essentials', '', 1, '2024-07-19 11:30:06', 'admin', '2024-07-19 11:30:06', 'admin'),
('coldd37594', 'Cold Drinks & Juices', '', 0, '2024-07-18 17:07:02', 'admin', '2024-08-10 13:41:28', 'admin'),
('dairy64076', 'Dairy, Tea & Drinks', '', 1, '2024-07-18 14:36:05', 'admin', '2024-08-10 13:46:13', 'admin'),
('froze52579', 'Frozen Food & Ice Creams', '', 0, '2024-07-18 17:06:28', 'admin', '2024-08-10 13:41:35', 'admin'),
('fruit20420', 'Fruits & Vegetables', '', 1, '2024-07-18 17:08:06', 'admin', '2024-08-10 13:41:51', 'admin'),
('groom1229', 'Grooming Essentials', '', 0, '2024-07-19 11:31:37', 'admin', '2024-08-10 13:41:55', 'admin'),
('groom25370', 'Grooming Essentials', '', 0, '2024-07-19 11:31:37', 'admin', '2024-07-19 11:33:25', 'admin'),
('homen29729', 'Home Needs', '', 0, '2024-07-19 11:30:53', 'admin', '2024-07-19 11:33:28', 'admin'),
('homen70647', 'Home Essentials', '', 1, '2024-07-19 11:33:43', 'admin', '2024-08-10 13:42:09', 'admin'),
('hygie19570', 'Personal Care', '', 0, '2024-07-19 11:31:55', 'admin', '2024-10-01 14:37:11', 'admin'),
('makeu93103', 'Cosmetics', '', 1, '2024-07-19 11:27:37', 'admin', '2024-08-10 13:43:01', 'admin'),
('masal63313', 'Masala & Dry Fruits', '', 0, '2024-07-18 17:05:51', 'admin', '2024-07-18 17:28:50', 'admin'),
('masal73543', 'Masala & Dry Fruits', '', 1, '2024-07-18 17:05:51', 'admin', '2024-07-18 17:05:51', 'admin'),
('meats80643', 'Meats, Fish & Eggs', '', 0, '2024-07-18 17:05:19', 'admin', '2024-08-10 13:43:05', 'admin'),
('munch23538', 'Munchies & Chips ', '', 0, '2024-07-18 17:07:11', 'admin', '2024-08-10 13:43:09', 'admin'),
('packa64266', 'Packaged Food', '', 0, '2024-07-18 17:06:49', 'admin', '2024-08-10 13:43:14', 'admin'),
('pooja9554', 'Pooja Samagri', '', 1, '2024-08-10 14:06:59', 'admin', '2024-11-15 19:19:32', 'admin'),
('skinc16134', 'Skincare', '', 0, '2024-07-19 11:29:38', 'admin', '2024-08-10 13:43:23', 'admin'),
('sweet36873', 'Sweet Cravings', '', 0, '2024-07-18 17:06:17', 'admin', '2024-08-10 13:43:26', 'admin'),
('teaco55536', 'Tea, Coffee & Drinks', '', 0, '2024-07-18 17:07:37', 'admin', '2024-08-10 14:06:48', 'admin'),
('veget23057', 'Vegetables', '', 0, '2024-08-08 20:58:33', 'admin', '2024-08-10 13:43:29', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
