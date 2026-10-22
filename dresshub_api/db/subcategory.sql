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
-- Table structure for table `subcategory`
--

CREATE TABLE `subcategory` (
  `subcategory_id` varchar(20) NOT NULL,
  `subcategoryname` varchar(100) NOT NULL,
  `category_id` varchar(10) NOT NULL,
  `subcategoryimage` varchar(200) NOT NULL,
  `sequence` int(10) NOT NULL,
  `isactive` int(10) NOT NULL DEFAULT 1,
  `createdon` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdby` varchar(20) NOT NULL DEFAULT 'admin',
  `updatedon` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedby` varchar(20) NOT NULL DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `subcategory`
--

INSERT INTO `subcategory` (`subcategory_id`, `subcategoryname`, `category_id`, `subcategoryimage`, `sequence`, `isactive`, `createdon`, `createdby`, `updatedon`, `updatedby`) VALUES
('atta&65810', 'Others', 'attar23346', '', 6, 1, '2024-07-18 17:23:53', 'admin', '2024-09-21 15:48:45', 'admin'),
('atta50608', 'Atta', 'attar23346', '', 1, 1, '2024-08-10 13:55:16', 'admin', '2024-09-21 15:49:10', 'admin'),
('babyb57277', 'Formula Milk', 'babyc42146', '', 1, 1, '2024-07-22 13:06:09', 'admin', '2024-09-21 15:52:28', 'admin'),
('babyf5521', 'Food', 'babyc42146', '', 2, 1, '2024-07-22 13:07:24', 'admin', '2024-09-21 20:34:48', 'admin'),
('babyf72254', 'Baby Food', 'packa64266', '', 0, 0, '2024-07-18 17:42:26', 'admin', '2024-08-10 08:53:17', 'admin'),
('babyh14103', 'Baby Care', 'babyc42146', '', 3, 1, '2024-07-22 13:06:21', 'admin', '2024-09-21 15:52:48', 'admin'),
('babyh47238', 'Diapers', 'babyc42146', '', 4, 1, '2024-07-22 13:12:01', 'admin', '2024-09-21 20:37:16', 'admin'),
('babyo15752', 'Baby Oral Care', 'babyc42146', '', 0, 0, '2024-07-22 13:06:48', 'admin', '2024-07-22 13:17:30', 'admin'),
('babyo27786', 'Baby Oral & Nasal Care', 'babyc42146', '', 0, 0, '2024-07-22 13:10:08', 'admin', '2024-08-10 08:55:05', 'admin'),
('babys91341', 'Baby Skin & Hair care', 'babyc42146', '', 0, 0, '2024-07-22 13:06:34', 'admin', '2024-08-10 08:55:09', 'admin'),
('babyw52653', 'Baby wipes', 'babyc42146', '', 0, 0, '2024-07-22 13:07:00', 'admin', '2024-08-10 08:55:18', 'admin'),
('bakin14823', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:41:57', 'admin'),
('bakin16056', 'Baking Mixes & Ingredients', 'packa64266', '', 0, 0, '2024-07-18 17:40:22', 'admin', '2024-08-07 13:42:02', 'admin'),
('bakin17273', 'Baking Mixes & Ingre', 'packa64266', '', 0, 0, '2024-07-18 17:40:22', 'admin', '2024-07-18 17:40:59', 'admin'),
('bakin2467', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:07', 'admin'),
('bakin31343', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:14', 'admin'),
('bakin37235', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:20', 'admin'),
('bakin49093', 'Baking Mixes & Ingre', 'packa64266', '', 0, 0, '2024-07-18 17:40:22', 'admin', '2024-07-18 17:40:53', 'admin'),
('bakin56121', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:27', 'admin'),
('bakin56703', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:35', 'admin'),
('bakin57231', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:39', 'admin'),
('bakin76891', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:43', 'admin'),
('bakin8521', 'Baking Mixes & Ingre', 'packa64266', '', 0, 0, '2024-07-18 17:40:27', 'admin', '2024-07-18 17:40:50', 'admin'),
('bakin91718', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-07 13:42:48', 'admin'),
('bakin9475', 'Baking Mixes & Ingredients', 'masal73543', '', 0, 0, '2024-08-07 13:41:10', 'admin', '2024-08-10 13:58:06', 'admin'),
('batha7019', 'Bath Accessories', 'bath,26350', '', 0, 0, '2024-07-22 13:27:38', 'admin', '2024-08-10 14:28:08', 'admin'),
('batte50771', 'Batter & Mixes', 'break52600', '', 0, 0, '2024-07-18 17:51:42', 'admin', '2024-08-10 14:23:25', 'admin'),
('batte71832', ' Batters & Mixes', 'dairy64076', '', 0, 0, '2024-07-18 17:23:01', 'admin', '2024-07-19 11:35:47', 'admin'),
('biscu60311', 'Biscuits', 'biscu15589', '', 2, 1, '2024-07-31 14:32:48', 'admin', '2024-10-04 20:27:05', 'admin'),
('bread12495', 'Bread & Bun', 'break52600', '', 0, 0, '2024-07-18 17:52:22', 'admin', '2024-08-10 14:22:30', 'admin'),
('bread64813', 'Bread', 'biscu15589', '', 3, 1, '2024-08-10 14:21:47', 'admin', '2024-10-04 20:27:16', 'admin'),
('bread81178', 'Breads and buns ', 'dairy64076', '', 0, 0, '2024-07-18 17:11:29', 'admin', '2024-07-19 11:36:17', 'admin'),
('break31960', 'Breakfast Cereals', 'break52600', '', 0, 0, '2024-07-18 17:50:54', 'admin', '2024-08-10 14:23:21', 'admin'),
('butte66985', 'Butter', 'dairy64076', '', 0, 0, '2024-07-18 17:12:09', 'admin', '2024-07-18 17:41:09', 'admin'),
('butte76384', 'Butter', 'dairy64076', '', 0, 0, '2024-07-18 17:12:09', 'admin', '2024-08-10 14:03:10', 'admin'),
('candi93954', 'Candies, Gums & Mints', 'sweet36873', '', 0, 0, '2024-07-18 17:33:37', 'admin', '2024-08-10 19:10:06', 'admin'),
('chees55719', 'Cheese', 'dairy64076', '', 0, 0, '2024-07-18 17:12:35', 'admin', '2024-08-10 14:03:09', 'admin'),
('chhat83519', 'Chhath pooja', 'pooja9554', '', 13, 1, '2024-10-29 08:06:29', 'admin', '2024-10-29 08:06:29', 'admin'),
('chick68528', 'Chicken,	Fish & Sea Food', 'meats80643', '', 0, 0, '2024-07-18 17:25:48', 'admin', '2024-07-19 11:52:06', 'admin'),
('chick77421', 'Chicken', 'meats80643', '', 0, 0, '2024-07-18 17:25:33', 'admin', '2024-07-19 11:51:56', 'admin'),
('chips30153', 'Chips & Crisps', 'munch23538', '', 0, 0, '2024-07-18 17:47:13', 'admin', '2024-08-10 19:10:10', 'admin'),
('choco1201', 'Chocolates', 'biscu15589', '', 5, 1, '2024-08-02 16:16:26', 'admin', '2024-10-04 20:27:36', 'admin'),
('choco82212', 'Chocolate Packs', 'sweet36873', '', 0, 0, '2024-07-18 17:35:24', 'admin', '2024-08-10 19:10:16', 'admin'),
('choco82230', 'Chocolates', 'sweet36873', '', 0, 0, '2024-07-18 17:32:28', 'admin', '2024-08-10 19:10:21', 'admin'),
('coffe74542', 'Coffee', 'coldd37594', '', 0, 0, '2024-07-18 17:52:44', 'admin', '2024-08-10 19:10:24', 'admin'),
('coffe75205', 'Coffee', 'teaco55536', '', 0, 0, '2024-07-26 19:56:34', 'admin', '2024-08-10 11:11:13', 'admin'),
('coldd33128', 'Cold Drinks', 'dairy64076', '', 3, 1, '2024-08-10 14:15:40', 'admin', '2024-10-04 20:25:59', 'admin'),
('cooki20902', 'Cookies', 'biscu15589', '', 0, 0, '2024-07-18 17:54:43', 'admin', '2024-08-10 14:20:00', 'admin'),
('cream8088', 'Creamfills', 'biscu15589', '', 0, 0, '2024-07-18 17:55:08', 'admin', '2024-08-10 14:20:11', 'admin'),
('daily39865', 'Daily Pooja Items', 'pooja9554', '', 2, 1, '2024-08-10 14:51:41', 'admin', '2024-10-04 20:35:54', 'admin'),
('dals&7648', 'Dal', 'attar23346', '', 3, 1, '2024-07-18 17:24:15', 'admin', '2024-09-21 15:48:23', 'admin'),
('dates83616', 'Dates & Seeds', 'masal73543', '', 0, 0, '2024-07-18 17:31:40', 'admin', '2024-08-10 14:02:01', 'admin'),
('deos24806', 'Deos', 'groom1229', '', 0, 1, '2024-07-23 11:33:53', 'admin', '2024-07-23 11:33:53', 'admin'),
('desse67889', 'Dessert Mixes', 'sweet36873', '', 0, 0, '2024-07-18 17:33:51', 'admin', '2024-08-10 19:10:30', 'admin'),
('deter1141', 'Soap & Detergents', 'clean10142', '', 1, 1, '2024-08-10 14:41:24', 'admin', '2024-09-21 16:24:52', 'admin'),
('diape43989', 'Diapers', 'babyc42146', '', 0, 0, '2024-07-22 13:05:51', 'admin', '2024-08-10 12:24:45', 'admin'),
('diges64942', 'Digestives', 'teaco55536', '', 0, 0, '2024-07-18 17:56:15', 'admin', '2024-08-10 19:10:36', 'admin'),
('diwal1481', 'Diwali', 'pooja9554', '', 12, 1, '2024-10-29 08:06:10', 'admin', '2024-10-29 08:06:10', 'admin'),
('drink92713', 'Drink Mixes', 'teaco55536', '', 0, 0, '2024-07-18 17:53:39', 'admin', '2024-08-10 19:10:39', 'admin'),
('dryfr413', 'Dry Fruits', 'masal73543', '', 4, 1, '2024-08-10 14:00:22', 'admin', '2024-10-04 20:23:11', 'admin'),
('dryfr50099', 'Dry Fruits & Nuts', 'munch23538', '', 0, 0, '2024-07-18 17:48:03', 'admin', '2024-08-10 19:10:44', 'admin'),
('dryfr57908', 'Dry Fruits and Nuts ', 'masal73543', '', 0, 0, '2024-07-18 17:28:10', 'admin', '2024-07-19 07:13:50', 'admin'),
('eggs26457', 'Eggs', 'dairy64076', '', 0, 0, '2024-07-18 17:11:11', 'admin', '2024-07-19 07:14:21', 'admin'),
('eggs33456', 'Eggs ', 'meats80643', '', 0, 0, '2024-07-18 17:26:59', 'admin', '2024-08-10 19:27:41', 'admin'),
('elect76044', 'Electronics', 'homen70647', '', 5, 1, '2024-08-10 14:47:15', 'admin', '2024-10-04 20:35:13', 'admin'),
('energ71246', 'Energy Bars', 'munch23538', '', 0, 0, '2024-07-18 17:48:18', 'admin', '2024-08-10 19:10:53', 'admin'),
('eyes14460', 'Eyes', 'makeu93103', '', 7, 1, '2024-07-19 12:00:23', 'admin', '2024-10-04 20:31:48', 'admin'),
('face55262', 'Face', 'makeu93103', '', 2, 1, '2024-07-19 12:01:05', 'admin', '2024-10-04 20:30:12', 'admin'),
('facec34060', 'Face Care & Creams', 'bath,26350', '', 0, 1, '2024-08-10 14:28:27', 'admin', '2024-08-10 14:28:27', 'admin'),
('famil93464', 'Family Pack', 'froze52579', '', 0, 0, '2024-07-18 17:37:11', 'admin', '2024-08-10 19:11:00', 'admin'),
('femal11000', 'Female Hygiene', 'hygie19570', '', 0, 1, '2024-08-10 14:35:04', 'admin', '2024-08-10 14:35:04', 'admin'),
('femin12872', 'Feminine Hygiene', 'hygie19570', '', 0, 0, '2024-07-22 13:08:29', 'admin', '2024-07-22 13:18:11', 'admin'),
('femin45670', 'Feminine Care', 'hygie19570', '', 0, 0, '2024-07-22 13:15:37', 'admin', '2024-08-10 14:34:13', 'admin'),
('flavo48447', 'Flavoured Yogurts', 'sweet36873', '', 0, 0, '2024-07-18 17:34:29', 'admin', '2024-08-10 19:11:04', 'admin'),
('fresh13309', 'Fresh Fruits', 'fruit20420', '', 0, 1, '2024-07-18 17:56:54', 'admin', '2024-07-18 17:56:54', 'admin'),
('fresh45217', 'Fresh Vegetables', 'fruit20420', '', 0, 1, '2024-07-18 17:57:17', 'admin', '2024-07-18 17:57:17', 'admin'),
('froze95606', 'Frozen Veggies', 'froze52579', '', 0, 0, '2024-07-18 17:38:39', 'admin', '2024-08-10 19:11:08', 'admin'),
('fruit43971', 'Fruit Juices & Drinks', 'coldd37594', '', 0, 0, '2024-07-18 17:44:37', 'admin', '2024-08-10 19:11:11', 'admin'),
('ghee98995', 'Ghee', 'attar23346', '', 5, 0, '2024-07-18 17:25:04', 'admin', '2024-09-21 15:48:42', 'admin'),
('gluco15959', 'Glucose & Marie', 'teaco55536', '', 0, 0, '2024-07-18 17:56:31', 'admin', '2024-08-10 19:28:21', 'admin'),
('green27361', 'Green and Flavoured ', 'teaco55536', '', 0, 0, '2024-07-18 17:54:03', 'admin', '2024-08-10 19:28:24', 'admin'),
('hairo72850', 'Hair Care', 'bath,26350', '', 3, 1, '2024-07-22 13:26:50', 'admin', '2024-10-04 20:28:54', 'admin'),
('handw61968', 'Handwash & Sanitizers', 'clean10142', '', 2, 1, '2024-08-10 14:42:40', 'admin', '2024-09-21 16:25:04', 'admin'),
('healt5945', 'Health & Wellness', 'dairy64076', '', 5, 1, '2024-08-10 14:16:06', 'admin', '2024-10-04 20:26:16', 'admin'),
('honey14854', 'Honey & Spreads', 'break52600', '', 0, 0, '2024-07-18 17:50:08', 'admin', '2024-08-10 14:23:08', 'admin'),
('icecr53914', 'Ice Cream & Frozen Dessert', 'sweet36873', '', 0, 0, '2024-07-18 17:36:09', 'admin', '2024-08-10 19:11:16', 'admin'),
('india63319', 'Indian Sweets', 'sweet36873', '', 0, 0, '2024-07-18 17:32:46', 'admin', '2024-08-10 19:11:19', 'admin'),
('insta68150', 'Instant Drink Mixes', 'coldd37594', '', 0, 1, '2024-07-18 17:46:19', 'admin', '2024-07-18 17:46:19', 'admin'),
('kabab40406', 'Kabab & Marinades', 'meats80643', '', 0, 0, '2024-07-18 17:26:23', 'admin', '2024-07-19 11:52:30', 'admin'),
('ketch93666', 'Ketchup & Sauces', 'break52600', '', 0, 0, '2024-07-18 17:50:42', 'admin', '2024-08-10 14:23:49', 'admin'),
('kitch96096', 'Kitchen', 'clean10142', '', 3, 1, '2024-08-10 14:41:47', 'admin', '2024-09-21 16:25:11', 'admin'),
('leafy55248', 'Leafy, Herbs & Seaso', 'teaco55536', '', 0, 0, '2024-07-18 17:57:43', 'admin', '2024-07-19 11:53:26', 'admin'),
('leafy63974', 'Leafy, Herbs & Seasonings', 'fruit20420', '', 0, 0, '2024-07-19 11:54:21', 'admin', '2024-08-10 17:25:26', 'admin'),
('lips15881', 'Lips', 'makeu93103', '', 5, 1, '2024-07-19 12:00:37', 'admin', '2024-10-04 20:31:41', 'admin'),
('men\'\'43709', 'Men\'\'s Grooming', 'hygie19570', '', 0, 0, '2024-08-10 14:34:42', 'admin', '2024-08-10 14:35:55', 'admin'),
('men\'s68771', 'Men\'s Grooming', 'hygie19570', '', 0, 1, '2024-08-10 14:36:21', 'admin', '2024-08-10 14:36:21', 'admin'),
('mensh48974', 'Mens Hygiene', 'bath,26350', '', 7, 1, '2024-09-21 19:35:39', 'admin', '2024-09-21 19:35:39', 'admin'),
('milk79057', 'Dairy', 'dairy64076', '', 1, 1, '2024-07-18 14:36:24', 'admin', '2024-10-04 20:25:40', 'admin'),
('milkb57600', 'Juice & Drinks', 'dairy64076', '', 4, 1, '2024-07-18 17:23:31', 'admin', '2024-10-04 20:26:10', 'admin'),
('milkd28560', 'Milk Drinks', 'coldd37594', '', 0, 0, '2024-07-18 17:45:28', 'admin', '2024-08-10 19:11:26', 'admin'),
('momca5296', 'Mom Care', 'babyc42146', '', 0, 0, '2024-07-22 13:11:34', 'admin', '2024-08-10 14:39:52', 'admin'),
('muesl2603', 'Muesli & Oats', 'break52600', '', 0, 0, '2024-07-18 17:50:23', 'admin', '2024-08-10 14:23:39', 'admin'),
('mutto96194', 'Mutton', 'meats80643', '', 0, 0, '2024-07-18 17:26:07', 'admin', '2024-07-19 11:55:31', 'admin'),
('nacho39310', 'Nachos', 'munch23538', '', 0, 0, '2024-07-18 17:48:37', 'admin', '2024-08-10 19:11:29', 'admin'),
('nails94229', 'Nails', 'makeu93103', '', 9, 1, '2024-07-19 12:00:51', 'admin', '2024-10-04 20:32:02', 'admin'),
('namke27299', 'Namkeens', 'biscu15589', '', 4, 1, '2024-08-10 14:21:18', 'admin', '2024-10-04 20:27:27', 'admin'),
('namke60075', 'Namkeens', 'munch23538', '', 0, 0, '2024-07-18 17:47:47', 'admin', '2024-08-10 19:11:32', 'admin'),
('non-a58845', 'Non-Alco & Energy Drinks', 'coldd37594', '', 0, 0, '2024-07-18 17:45:15', 'admin', '2024-08-10 19:11:36', 'admin'),
('nonve16330', 'Non Veg Frozen', 'meats80643', '', 0, 0, '2024-07-18 17:27:39', 'admin', '2024-08-10 11:12:16', 'admin'),
('nonve42876', 'Non Veg Snacks', 'froze52579', '', 0, 0, '2024-07-18 17:37:46', 'admin', '2024-08-10 11:12:27', 'admin'),
('nonve49050', 'Non Veg Masala', 'meats80643', '', 0, 0, '2024-07-18 17:27:18', 'admin', '2024-08-10 14:01:51', 'admin'),
('noodl17804', 'Noodles & Vermicelli', 'packa64266', '', 0, 0, '2024-07-18 17:39:14', 'admin', '2024-08-10 19:11:43', 'admin'),
('noodl62810', 'Noodles', 'biscu15589', '', 6, 1, '2024-08-10 14:21:08', 'admin', '2024-10-04 20:27:52', 'admin'),
('nursi33007', 'Nursing', 'babyc42146', '', 0, 0, '2024-07-22 13:10:47', 'admin', '2024-08-10 14:39:45', 'admin'),
('oil89161', 'Oil, Ghee & Refine', 'attar23346', '', 4, 1, '2024-07-18 17:24:49', 'admin', '2024-09-21 15:48:40', 'admin'),
('oralc68478', 'Dental Care', 'bath,26350', '', 4, 1, '2024-07-22 13:28:03', 'admin', '2024-10-04 20:29:02', 'admin'),
('organ5500', 'Organic Salt, Sugar ', 'fruit20420', '', 0, 0, '2024-07-18 17:58:38', 'admin', '2024-08-10 14:00:49', 'admin'),
('other15110', 'Others', 'makeu93103', '', 11, 1, '2024-08-10 14:32:35', 'admin', '2024-10-04 20:32:10', 'admin'),
('other25202', 'Others', 'clean10142', '', 5, 1, '2024-08-10 14:44:56', 'admin', '2024-09-21 16:25:26', 'admin'),
('other29758', 'Others', 'fruit20420', '', 0, 1, '2024-08-10 14:48:31', 'admin', '2024-08-10 14:48:31', 'admin'),
('other33788', 'Others', 'dairy64076', '', 7, 1, '2024-08-10 14:16:19', 'admin', '2024-10-04 20:26:25', 'admin'),
('other40659', 'Others', 'pooja9554', '', 11, 1, '2024-08-10 14:49:29', 'admin', '2024-10-04 20:36:13', 'admin'),
('other53804', 'Others', 'homen70647', '', 11, 1, '2024-08-10 14:47:24', 'admin', '2024-10-04 20:35:19', 'admin'),
('other66630', 'Others', 'biscu15589', '', 8, 1, '2024-08-10 14:21:55', 'admin', '2024-10-04 20:28:08', 'admin'),
('other83541', 'Others', 'masal73543', '', 7, 1, '2024-08-10 14:02:33', 'admin', '2024-10-04 20:24:53', 'admin'),
('other87649', 'Others', 'babyc42146', '', 5, 1, '2024-08-10 14:40:25', 'admin', '2024-09-21 20:37:01', 'admin'),
('other91057', 'Others', 'hygie19570', '', 0, 1, '2024-08-10 14:37:04', 'admin', '2024-08-10 14:37:04', 'admin'),
('other932', 'Others', 'bath,26350', '', 11, 1, '2024-08-10 14:29:04', 'admin', '2024-10-04 20:29:25', 'admin'),
('packa12444', 'Packaged Sweets', 'biscu15589', '', 7, 1, '2024-08-10 14:21:39', 'admin', '2024-10-04 20:28:01', 'admin'),
('panco26241', 'Pan Corner', 'biscu15589', '', 18, 1, '2024-12-01 14:33:56', 'admin', '2024-12-01 14:33:56', 'admin'),
('panee54489', 'Paneer & Cream', 'dairy64076', '', 0, 0, '2024-07-18 17:11:46', 'admin', '2024-08-10 14:07:38', 'admin'),
('panee71103', 'Paneer & Cream', 'dairy64076', '', 0, 0, '2024-07-18 17:11:47', 'admin', '2024-07-18 17:30:19', 'admin'),
('papad95868', 'Papad & Pickles', 'masal73543', '', 3, 1, '2024-07-18 17:31:59', 'admin', '2024-10-04 20:22:56', 'admin'),
('pasta95195', 'Pasta & Soups', 'packa64266', '', 0, 0, '2024-07-18 17:42:41', 'admin', '2024-08-10 19:26:13', 'admin'),
('pastr10950', 'Pastries & Cakes', 'sweet36873', '', 0, 0, '2024-07-18 17:33:09', 'admin', '2024-08-10 19:26:05', 'admin'),
('peanu58891', 'Peanut Butter', 'break52600', '', 0, 0, '2024-07-18 17:51:28', 'admin', '2024-08-10 14:23:34', 'admin'),
('perso87788', 'Personal Care', 'bath,26350', '', 9, 1, '2024-09-21 19:36:02', 'admin', '2024-09-21 19:36:02', 'admin'),
('plast20044', 'Plastics', 'homen70647', '', 2, 1, '2024-08-10 14:45:33', 'admin', '2024-10-04 20:35:04', 'admin'),
('popco87985', 'Popcorns', 'munch23538', '', 0, 0, '2024-07-18 17:49:20', 'admin', '2024-08-10 19:26:01', 'admin'),
('powde26983', 'Powders & Pastes', 'masal73543', '', 0, 0, '2024-07-18 17:28:33', 'admin', '2024-07-18 17:30:14', 'admin'),
('powde76947', 'Powders & Pastes', 'masal73543', '', 2, 1, '2024-07-18 17:28:32', 'admin', '2024-10-04 20:22:36', 'admin'),
('prasa97249', 'Prasad', 'pooja9554', '', 5, 1, '2024-08-10 14:51:50', 'admin', '2024-10-04 20:36:04', 'admin'),
('prote38344', 'Protein & Energy Bar', 'sweet36873', '', 0, 0, '2024-07-18 17:34:05', 'admin', '2024-08-10 19:26:21', 'admin'),
('pulse532', 'Millets', 'fruit20420', '', 0, 0, '2024-07-18 17:58:00', 'admin', '2024-08-10 17:25:37', 'admin'),
('ready2060', 'Ready To Drink', 'teaco55536', '', 0, 0, '2024-07-18 17:54:22', 'admin', '2024-08-10 19:28:42', 'admin'),
('ready86707', 'Ready To Cook', 'packa64266', '', 0, 0, '2024-07-18 17:43:22', 'admin', '2024-08-10 19:26:26', 'admin'),
('ready88962', 'Ready To Eat', 'packa64266', '', 0, 0, '2024-07-18 17:43:39', 'admin', '2024-08-10 19:26:31', 'admin'),
('rice&44696', 'Rice', 'attar23346', '', 2, 1, '2024-07-18 17:24:34', 'admin', '2024-09-21 15:48:15', 'admin'),
('rice&50821', 'Rice & Rice Products', 'fruit20420', '', 0, 0, '2024-07-18 17:59:00', 'admin', '2024-08-10 17:25:43', 'admin'),
('roti&35980', 'Roti & Paratha', 'froze52579', '', 0, 0, '2024-07-18 17:38:21', 'admin', '2024-08-10 19:26:35', 'admin'),
('rusk&24542', 'Rusk & Khari', 'teaco55536', '', 0, 0, '2024-07-18 17:55:45', 'admin', '2024-08-10 19:28:46', 'admin'),
('salt,97546', 'Salt & Sugar', 'masal73543', '', 5, 1, '2024-07-18 17:31:29', 'admin', '2024-10-04 20:23:23', 'admin'),
('salty26682', 'Salty & Crackers', 'teaco55536', '', 0, 0, '2024-07-18 17:56:01', 'admin', '2024-08-10 19:55:03', 'admin'),
('sausa97156', 'Sausages & Salami ', 'meats80643', '', 0, 0, '2024-07-18 17:26:41', 'admin', '2024-07-19 11:58:44', 'admin'),
('shamp97961', 'Shampoo & Conditioner', 'bath,26350', '', 0, 0, '2024-07-22 13:26:30', 'admin', '2024-08-10 14:27:31', 'admin'),
('showe89553', 'Shower Gels', 'bath,26350', '', 0, 0, '2024-07-22 13:27:23', 'admin', '2024-08-10 14:26:21', 'admin'),
('singl67885', 'Single Pack', 'froze52579', '', 0, 0, '2024-07-18 17:37:28', 'admin', '2024-08-10 19:27:10', 'admin'),
('skin35752', 'Skin', 'makeu93103', '', 3, 1, '2024-08-12 19:21:05', 'admin', '2024-10-04 20:30:20', 'admin'),
('soap13861', 'Soap', 'clean10142', '', 0, 0, '2024-08-10 14:41:34', 'admin', '2024-08-10 14:43:31', 'admin'),
('soaps42123', 'Soaps & Gels', 'bath,26350', '', 2, 1, '2024-07-22 13:27:07', 'admin', '2024-10-04 20:28:48', 'admin'),
('soda&77603', 'Soda & Mixers', 'coldd37594', '', 0, 0, '2024-07-18 17:45:54', 'admin', '2024-08-10 19:26:43', 'admin'),
('softd40864', 'Soft Drinks', 'coldd37594', '', 0, 0, '2024-07-18 17:44:14', 'admin', '2024-08-10 19:26:47', 'admin'),
('spice13920', 'Spices & Vinegar', 'fruit20420', '', 0, 0, '2024-07-18 17:58:14', 'admin', '2024-08-10 17:25:53', 'admin'),
('stati10075', 'Stationary', 'homen70647', '', 15, 1, '2024-11-04 20:15:20', 'admin', '2024-11-04 20:15:20', 'admin'),
('syrup67416', 'Syrups', 'sweet36873', '', 0, 0, '2024-07-18 17:34:55', 'admin', '2024-08-10 19:26:51', 'admin'),
('talcu52268', 'Talcum Powder', 'bath,26350', '', 0, 0, '2024-07-22 13:27:50', 'admin', '2024-08-10 14:27:57', 'admin'),
('tea&c66933', 'Tea & Coffee', 'dairy64076', '', 2, 1, '2024-08-10 14:07:14', 'admin', '2024-10-04 20:25:47', 'admin'),
('tea&c69427', 'Tea & Coffee', 'break52600', '', 0, 0, '2024-07-18 17:52:02', 'admin', '2024-08-10 14:08:21', 'admin'),
('tea74765', 'Tea', 'teaco55536', '', 0, 0, '2024-07-18 17:53:15', 'admin', '2024-08-10 19:28:51', 'admin'),
('test44868', 'Test', 'masal73543', '', 0, 0, '2024-08-10 08:49:08', 'admin', '2024-08-10 13:57:46', 'admin'),
('toile1939', 'Toilets & Floor', 'clean10142', '', 4, 1, '2024-08-10 14:41:58', 'admin', '2024-09-21 16:25:20', 'admin'),
('tools53614', 'Tools & Brushes', 'makeu93103', '', 0, 0, '2024-07-19 12:03:48', 'admin', '2024-08-10 14:32:23', 'admin'),
('vegan47424', 'Vegan Drinks', 'coldd37594', '', 0, 0, '2024-07-18 17:46:30', 'admin', '2024-08-10 19:26:56', 'admin'),
('vegsn36023', 'Veg Snacks', 'froze52579', '', 0, 0, '2024-07-18 17:38:01', 'admin', '2024-08-10 19:27:00', 'admin'),
('wafer555', 'Wafers', 'biscu15589', '', 0, 0, '2024-07-18 17:55:31', 'admin', '2024-08-10 14:20:18', 'admin'),
('waffy96514', 'Waffy', 'biscu15589', '', 0, 0, '2024-08-02 16:39:08', 'admin', '2024-08-10 14:20:23', 'admin'),
('water27724', 'Water', 'coldd37594', '', 0, 0, '2024-07-18 17:44:56', 'admin', '2024-08-10 19:27:04', 'admin'),
('whole98455', 'Whole Spices', 'masal73543', '', 1, 1, '2024-07-18 17:30:56', 'admin', '2024-09-21 15:49:59', 'admin'),
('women17589', 'Women\'s Grooming', 'hygie19570', '', 0, 0, '2024-07-22 13:14:46', 'admin', '2024-08-10 14:34:09', 'admin'),
('women57468', 'Women Hygiene', 'bath,26350', '', 8, 1, '2024-09-21 19:35:52', 'admin', '2024-09-21 19:35:52', 'admin'),
('yogur6119', 'Yogurts & Dahi ', 'dairy64076', '', 0, 0, '2024-07-18 17:10:45', 'admin', '2024-08-10 14:08:27', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD PRIMARY KEY (`subcategory_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
