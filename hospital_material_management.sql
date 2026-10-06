-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 06, 2026 lúc 06:43 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hospital_material_management`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `department`
--

CREATE TABLE `department` (
  `id` bigint(20) NOT NULL,
  `code` varchar(30) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(200) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `head_user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `department`
--

INSERT INTO `department` (`id`, `code`, `created_at`, `name`, `phone_number`, `updated_at`, `head_user_id`) VALUES
(1, 'KNK', '0000-00-00 00:00:00.000000', 'Khoa Nội Khoa', '0901234567', '0000-00-00 00:00:00.000000', 4),
(2, 'KNH', '0000-00-00 00:00:00.000000', 'Khoa Nhi', '0901234568', '0000-00-00 00:00:00.000000', NULL),
(3, 'KVTTBYT', '0000-00-00 00:00:00.000000', 'Phòng Vật tư thiết bị y tế', '0901234569', '0000-00-00 00:00:00.000000', NULL),
(4, 'KTCKT', '0000-00-00 00:00:00.000000', 'Phòng Tài chính kế toán', '0901234570', '0000-00-00 00:00:00.000000', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `goods_receipt`
--

CREATE TABLE `goods_receipt` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `receipt_date` date NOT NULL,
  `status` enum('DRAFT','FINALIZED','RECEIVED','VERIFIED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `finalized_by` bigint(20) DEFAULT NULL,
  `received_by` bigint(20) NOT NULL,
  `supplier_id` bigint(20) NOT NULL,
  `verified_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `goods_receipt`
--

INSERT INTO `goods_receipt` (`id`, `created_at`, `invoice_number`, `receipt_date`, `status`, `updated_at`, `finalized_by`, `received_by`, `supplier_id`, `verified_by`) VALUES
(1, '2026-01-20 09:00:00.000000', 'HD-2026-0101', '2026-01-20', 'FINALIZED', '2026-01-23 14:30:00.000000', 1, 2, 1, 3),
(2, '2026-02-18 09:00:00.000000', 'HD-2026-0218', '2026-02-18', 'FINALIZED', '2026-02-21 14:30:00.000000', 1, 2, 2, 3),
(3, '2026-03-25 09:00:00.000000', 'HD-2026-0325', '2026-03-25', 'FINALIZED', '2026-03-28 14:30:00.000000', 1, 2, 2, 3),
(4, '2026-04-22 09:00:00.000000', 'HD-2026-0422', '2026-04-22', 'FINALIZED', '2026-04-25 14:30:00.000000', 1, 2, 1, 3),
(5, '2026-05-27 09:00:00.000000', 'HD-2026-0527', '2026-05-27', 'FINALIZED', '2026-05-30 14:30:00.000000', 1, 2, 1, 3),
(6, '2026-07-22 09:00:00.000000', 'HD-2026-0722', '2026-07-22', 'FINALIZED', '2026-07-25 14:30:00.000000', 1, 2, 2, 3),
(7, '2026-09-15 09:00:00.000000', 'HD-2026-0915', '2026-09-15', 'VERIFIED', '2026-09-17 10:00:00.000000', NULL, 2, 1, 3),
(8, '2026-09-29 09:00:00.000000', 'HD-2026-0929', '2026-09-29', 'RECEIVED', '2026-09-30 08:45:00.000000', NULL, 2, 2, NULL),
(9, '2026-10-03 09:00:00.000000', 'HD-2026-1003', '2026-10-03', 'DRAFT', '2026-10-03 09:00:00.000000', NULL, 2, 1, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `goods_receipt_item`
--

CREATE TABLE `goods_receipt_item` (
  `id` bigint(20) NOT NULL,
  `batch_number` varchar(50) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `receipt_id` bigint(20) NOT NULL,
  `material_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `goods_receipt_item`
--

INSERT INTO `goods_receipt_item` (`id`, `batch_number`, `expiry_date`, `quantity`, `unit_price`, `receipt_id`, `material_id`) VALUES
(1, 'LOT2026-A01', '2028-01-31', 400, 85000.00, 1, 1),
(2, 'LOT2026-A02', '2028-01-31', 1500, 60000.00, 1, 4),
(3, 'LOT2026-B01', '2028-02-28', 300, 25000.00, 2, 3),
(4, 'LOT2026-B02', '2028-02-28', 600, 18000.00, 2, 5),
(5, 'LOT2026-C01', '2027-09-30', 500, 45000.00, 3, 2),
(6, 'LOT2026-C02', '2028-03-31', 1000, 61000.00, 3, 4),
(7, 'LOT2026-C03', '2026-10-28', 20, 24000.00, 3, 3),
(8, 'LOT2026-D01', '2028-04-30', 200, 26000.00, 4, 3),
(9, 'LOT2026-D02', '2028-04-30', 500, 18500.00, 4, 5),
(10, 'LOT2026-E01', '2028-05-31', 350, 87000.00, 5, 1),
(11, 'LOT2026-E02', '2028-05-31', 1200, 61000.00, 5, 4),
(12, 'LOT2026-F01', '2027-07-31', 600, 46000.00, 6, 2),
(13, 'LOT2026-F02', '2028-07-31', 400, 19000.00, 6, 5),
(14, 'LOT2026-G01', '2028-09-30', 300, 88000.00, 7, 1),
(15, 'LOT2026-G02', '2028-09-30', 250, 27000.00, 7, 3),
(16, 'LOT2026-H01', '2028-09-30', 1000, 62000.00, 8, 4),
(17, 'LOT2026-I01', '2027-10-31', 500, 46500.00, 9, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `issue_note`
--

CREATE TABLE `issue_note` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `issue_date` date NOT NULL,
  `issue_number` varchar(30) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `issued_by` bigint(20) NOT NULL,
  `received_by` bigint(20) NOT NULL,
  `requisition_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `issue_note`
--

INSERT INTO `issue_note` (`id`, `created_at`, `issue_date`, `issue_number`, `updated_at`, `issued_by`, `received_by`, `requisition_id`) VALUES
(1, '2026-01-28 10:00:00.000000', '2026-01-28', 'XK-20260128-001', '2026-01-28 10:00:00.000000', 2, 4, 1),
(2, '2026-02-11 10:00:00.000000', '2026-02-11', 'XK-20260211-001', '2026-02-11 10:00:00.000000', 2, 5, 2),
(3, '2026-03-12 10:00:00.000000', '2026-03-12', 'XK-20260312-001', '2026-03-12 10:00:00.000000', 2, 4, 3),
(4, '2026-04-16 10:00:00.000000', '2026-04-16', 'XK-20260416-001', '2026-04-16 10:00:00.000000', 2, 5, 4),
(5, '2026-05-14 10:00:00.000000', '2026-05-14', 'XK-20260514-001', '2026-05-14 10:00:00.000000', 2, 4, 5),
(6, '2026-06-11 10:00:00.000000', '2026-06-11', 'XK-20260611-001', '2026-06-11 10:00:00.000000', 2, 5, 6),
(7, '2026-07-16 10:00:00.000000', '2026-07-16', 'XK-20260716-001', '2026-07-16 10:00:00.000000', 2, 4, 7),
(8, '2026-08-20 10:00:00.000000', '2026-08-20', 'XK-20260820-001', '2026-08-20 10:00:00.000000', 2, 5, 8),
(9, '2026-09-10 10:00:00.000000', '2026-09-10', 'XK-20260910-001', '2026-09-10 10:00:00.000000', 2, 4, 9);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `material`
--

CREATE TABLE `material` (
  `id` bigint(20) NOT NULL,
  `category` varchar(30) NOT NULL,
  `code` varchar(30) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `material`
--

INSERT INTO `material` (`id`, `category`, `code`, `created_at`, `manufacturer`, `name`, `unit`, `updated_at`) VALUES
(1, 'Vật tư tiêu hao', 'VT001', '0000-00-00 00:00:00.000000', 'ABC Medical', 'Găng tay y tế vô trùng', 'Hộp', '0000-00-00 00:00:00.000000'),
(2, 'Vật tư tiêu hao', 'VT002', '0000-00-00 00:00:00.000000', 'XYZ Pharma', 'Khẩu trang y tế 4 lớp', 'Hộp', '0000-00-00 00:00:00.000000'),
(3, 'Vật tư tiêu hao', 'VT003', '0000-00-00 00:00:00.000000', 'DEF Medical', 'Bông gạc vô trùng', 'Gói', '0000-00-00 00:00:00.000000'),
(4, 'Vật tư tiêu hao', 'VT004', '0000-00-00 00:00:00.000000', 'GHI Equipment', 'Kim tiêm 5ml', 'Hộp', '0000-00-00 00:00:00.000000'),
(5, 'Vật tư tiêu hao', 'VT005', '0000-00-00 00:00:00.000000', 'ABC Medical', 'Dây truyền dịch', 'Cái', '0000-00-00 00:00:00.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `purchase_plan`
--

CREATE TABLE `purchase_plan` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `notes` text DEFAULT NULL,
  `plan_date` date NOT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFT','PENDING','REJECTED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `approved_by` bigint(20) DEFAULT NULL,
  `created_by` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `purchase_plan`
--

INSERT INTO `purchase_plan` (`id`, `created_at`, `notes`, `plan_date`, `status`, `updated_at`, `approved_by`, `created_by`) VALUES
(1, '2026-01-05 08:30:00.000000', 'Dự trù đặt hàng tháng 01/2026', '2026-01-05', 'COMPLETED', '2026-01-12 15:00:00.000000', 1, 2),
(2, '2026-02-03 08:30:00.000000', 'Dự trù đặt hàng tháng 02/2026', '2026-02-03', 'COMPLETED', '2026-02-10 15:00:00.000000', 1, 2),
(3, '2026-03-04 08:30:00.000000', 'Dự trù đặt hàng tháng 03/2026', '2026-03-04', 'COMPLETED', '2026-03-11 15:00:00.000000', 1, 2),
(4, '2026-04-06 08:30:00.000000', 'Dự trù đặt hàng tháng 04/2026', '2026-04-06', 'COMPLETED', '2026-04-13 15:00:00.000000', 1, 2),
(5, '2026-05-05 08:30:00.000000', 'Dự trù đặt hàng tháng 05/2026', '2026-05-05', 'COMPLETED', '2026-05-12 15:00:00.000000', 1, 2),
(6, '2026-06-03 08:30:00.000000', 'Dự trù đặt hàng tháng 06/2026\nTừ chối bởi Trưởng phòng VTTBYT: Số lượng dự trù vượt mức tiêu thụ 3 tháng gần nhất', '2026-06-03', 'REJECTED', '2026-06-05 10:00:00.000000', NULL, 2),
(7, '2026-07-06 08:30:00.000000', 'Dự trù đặt hàng tháng 07/2026', '2026-07-06', 'COMPLETED', '2026-07-13 15:00:00.000000', 1, 2),
(8, '2026-08-04 08:30:00.000000', 'Dự trù đặt hàng tháng 08/2026', '2026-08-04', 'APPROVED', '2026-08-07 11:00:00.000000', 1, 2),
(9, '2026-09-03 08:30:00.000000', 'Dự trù đặt hàng tháng 09/2026', '2026-09-03', 'PENDING', '2026-09-03 16:00:00.000000', NULL, 2),
(10, '2026-09-28 09:00:00.000000', 'Dự trù đặt hàng tháng 10/2026 (đang soạn)', '2026-09-28', 'DRAFT', '2026-09-28 09:00:00.000000', NULL, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `purchase_plan_item`
--

CREATE TABLE `purchase_plan_item` (
  `id` bigint(20) NOT NULL,
  `estimated_price` decimal(15,2) DEFAULT NULL,
  `requested_quantity` int(11) NOT NULL,
  `material_id` bigint(20) NOT NULL,
  `plan_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `purchase_plan_item`
--

INSERT INTO `purchase_plan_item` (`id`, `estimated_price`, `requested_quantity`, `material_id`, `plan_id`) VALUES
(1, 85000.00, 400, 1, 1),
(2, 60000.00, 1500, 4, 1),
(3, 25000.00, 300, 3, 2),
(4, 18000.00, 600, 5, 2),
(5, 45000.00, 500, 2, 3),
(6, 61000.00, 1000, 4, 3),
(7, 24000.00, 20, 3, 3),
(8, 26000.00, 200, 3, 4),
(9, 18500.00, 500, 5, 4),
(10, 87000.00, 350, 1, 5),
(11, 61000.00, 1200, 4, 5),
(12, 88000.00, 800, 1, 6),
(13, 46000.00, 1000, 2, 6),
(14, 46000.00, 600, 2, 7),
(15, 19000.00, 400, 5, 7),
(16, 46500.00, 400, 2, 8),
(17, 19500.00, 300, 5, 8),
(18, 62000.00, 800, 4, 9),
(19, 27000.00, 200, 3, 9),
(20, 88000.00, 300, 1, 10),
(21, 47000.00, 500, 2, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `requisition`
--

CREATE TABLE `requisition` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `requisition_date` date NOT NULL,
  `requisition_number` varchar(30) NOT NULL,
  `status` enum('APPROVED','DRAFT','ISSUED','PENDING','REJECTED','VERIFIED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `verified_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `requisition`
--

INSERT INTO `requisition` (`id`, `created_at`, `requisition_date`, `requisition_number`, `status`, `updated_at`, `created_by`, `department_id`, `verified_by`) VALUES
(1, '2026-01-26 08:15:00.000000', '2026-01-26', 'PL-20260126-001', 'ISSUED', '2026-01-28 10:00:00.000000', 4, 1, 2),
(2, '2026-02-09 08:20:00.000000', '2026-02-09', 'PL-20260209-001', 'ISSUED', '2026-02-11 10:00:00.000000', 5, 2, 2),
(3, '2026-03-10 08:10:00.000000', '2026-03-10', 'PL-20260310-001', 'ISSUED', '2026-03-12 10:00:00.000000', 4, 1, 2),
(4, '2026-04-14 08:25:00.000000', '2026-04-14', 'PL-20260414-001', 'ISSUED', '2026-04-16 10:00:00.000000', 5, 2, 2),
(5, '2026-05-12 08:05:00.000000', '2026-05-12', 'PL-20260512-001', 'ISSUED', '2026-05-14 10:00:00.000000', 4, 1, 2),
(6, '2026-06-09 08:40:00.000000', '2026-06-09', 'PL-20260609-001', 'ISSUED', '2026-06-11 10:00:00.000000', 5, 2, 2),
(7, '2026-07-14 08:15:00.000000', '2026-07-14', 'PL-20260714-001', 'ISSUED', '2026-07-16 10:00:00.000000', 4, 1, 2),
(8, '2026-08-18 08:30:00.000000', '2026-08-18', 'PL-20260818-001', 'ISSUED', '2026-08-20 10:00:00.000000', 5, 2, 2),
(9, '2026-09-08 08:20:00.000000', '2026-09-08', 'PL-20260908-001', 'ISSUED', '2026-09-10 10:00:00.000000', 4, 1, 2),
(10, '2026-09-22 08:35:00.000000', '2026-09-22', 'PL-20260922-001', 'APPROVED', '2026-09-24 09:30:00.000000', 5, 2, 2),
(11, '2026-09-30 08:10:00.000000', '2026-09-30', 'PL-20260930-001', 'VERIFIED', '2026-10-01 09:00:00.000000', 4, 1, 2),
(12, '2026-10-02 08:50:00.000000', '2026-10-02', 'PL-20261002-001', 'PENDING', '2026-10-02 08:50:00.000000', 5, 2, NULL),
(13, '2026-10-03 09:10:00.000000', '2026-10-03', 'PL-20261003-001', 'DRAFT', '2026-10-03 09:10:00.000000', 4, 1, NULL),
(14, '2026-08-25 08:45:00.000000', '2026-08-25', 'PL-20260825-001', 'REJECTED', '2026-08-26 09:00:00.000000', 5, 2, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `requisition_item`
--

CREATE TABLE `requisition_item` (
  `id` bigint(20) NOT NULL,
  `issued_quantity` int(11) DEFAULT NULL,
  `requested_quantity` int(11) NOT NULL,
  `material_id` bigint(20) NOT NULL,
  `requisition_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `requisition_item`
--

INSERT INTO `requisition_item` (`id`, `issued_quantity`, `requested_quantity`, `material_id`, `requisition_id`) VALUES
(1, 80, 80, 1, 1),
(2, 200, 200, 4, 1),
(3, 60, 60, 1, 2),
(4, 300, 300, 4, 2),
(5, 40, 40, 3, 3),
(6, 80, 80, 5, 3),
(7, 70, 70, 1, 3),
(8, 120, 120, 2, 4),
(9, 250, 250, 4, 4),
(10, 150, 150, 2, 5),
(11, 100, 100, 5, 5),
(12, 50, 50, 3, 5),
(13, 90, 90, 1, 6),
(14, 400, 400, 4, 6),
(15, 35, 35, 3, 6),
(16, 80, 80, 1, 7),
(17, 120, 120, 5, 7),
(18, 14, 14, 3, 7),
(19, 160, 160, 2, 8),
(20, 300, 300, 4, 8),
(21, 90, 90, 5, 8),
(22, 70, 70, 1, 9),
(23, 30, 30, 3, 9),
(24, 250, 250, 4, 9),
(25, 50, 50, 2, 10),
(26, 60, 60, 5, 10),
(27, 40, 40, 1, 11),
(28, 100, 100, 4, 11),
(29, NULL, 25, 3, 12),
(30, NULL, 40, 5, 12),
(31, NULL, 60, 2, 13),
(32, NULL, 500, 1, 14);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `stock`
--

CREATE TABLE `stock` (
  `id` bigint(20) NOT NULL,
  `batch_number` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `storage_location` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `material_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `stock`
--

INSERT INTO `stock` (`id`, `batch_number`, `created_at`, `expiry_date`, `quantity`, `storage_location`, `updated_at`, `material_id`) VALUES
(1, 'LOT2025001', '0000-00-00 00:00:00.000000', '2026-12-31', 500, 'Kệ A1', '0000-00-00 00:00:00.000000', 1),
(2, 'LOT2025002', '0000-00-00 00:00:00.000000', '2026-06-30', 1000, 'Kệ A2', '0000-00-00 00:00:00.000000', 2),
(3, 'LOT2025003', '0000-00-00 00:00:00.000000', '2027-01-31', 300, 'Kệ B1', '0000-00-00 00:00:00.000000', 3),
(4, 'LOT2025004', '0000-00-00 00:00:00.000000', '2026-09-30', 2000, 'Kệ C1', '0000-00-00 00:00:00.000000', 4),
(5, 'LOT2025005', '0000-00-00 00:00:00.000000', '2026-12-31', 800, 'Kệ C2', '0000-00-00 00:00:00.000000', 5),
(6, 'LOT2026-A01', '2026-01-23 14:30:00.000000', '2028-01-31', 100, 'Kệ A3', '2026-06-11 10:00:00.000000', 1),
(7, 'LOT2026-A02', '2026-01-23 14:30:00.000000', '2028-01-31', 750, 'Kệ C3', '2026-04-16 10:00:00.000000', 4),
(8, 'LOT2026-B01', '2026-02-21 14:30:00.000000', '2028-02-28', 210, 'Kệ B2', '2026-05-14 10:00:00.000000', 3),
(9, 'LOT2026-B02', '2026-02-21 14:30:00.000000', '2028-02-28', 420, 'Kệ C4', '2026-05-14 10:00:00.000000', 5),
(10, 'LOT2026-C01', '2026-03-28 14:30:00.000000', '2027-09-30', 230, 'Kệ A4', '2026-05-14 10:00:00.000000', 2),
(11, 'LOT2026-C02', '2026-03-28 14:30:00.000000', '2028-03-31', 600, 'Kệ C5', '2026-06-11 10:00:00.000000', 4),
(12, 'LOT2026-C03', '2026-03-28 14:30:00.000000', '2026-10-28', 6, 'Kệ B3', '2026-07-16 10:00:00.000000', 3),
(13, 'LOT2026-D01', '2026-04-25 14:30:00.000000', '2028-04-30', 135, 'Kệ B4', '2026-09-10 10:00:00.000000', 3),
(14, 'LOT2026-D02', '2026-04-25 14:30:00.000000', '2028-04-30', 380, 'Kệ C6', '2026-07-16 10:00:00.000000', 5),
(15, 'LOT2026-E01', '2026-05-30 14:30:00.000000', '2028-05-31', 200, 'Kệ A5', '2026-09-10 10:00:00.000000', 1),
(16, 'LOT2026-E02', '2026-05-30 14:30:00.000000', '2028-05-31', 650, 'Kệ C7', '2026-09-10 10:00:00.000000', 4),
(17, 'LOT2026-F01', '2026-07-25 14:30:00.000000', '2027-07-31', 440, 'Kệ A6', '2026-08-20 10:00:00.000000', 2),
(18, 'LOT2026-F02', '2026-07-25 14:30:00.000000', '2028-07-31', 310, 'Kệ C8', '2026-08-20 10:00:00.000000', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `supplier`
--

CREATE TABLE `supplier` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `supplier`
--

INSERT INTO `supplier` (`id`, `address`, `code`, `created_at`, `email`, `name`, `phone_number`, `updated_at`) VALUES
(1, '123 Nguyễn Văn Cừ, Q5, TP.HCM', 'NCC001', '0000-00-00 00:00:00.000000', 'abc@medical.vn', 'Công ty TNHH Thiết bị Y tế ABC', '0281234567', '0000-00-00 00:00:00.000000'),
(2, '456 Lý Thường Kiệt, Q10, TP.HCM', 'NCC002', '0000-00-00 00:00:00.000000', 'xyz@pharma.vn', 'Công ty Cổ phần Dược phẩm XYZ', '0281234568', '0000-00-00 00:00:00.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ACCOUNTANT','ADMIN','DEPARTMENT_HEAD','DEPARTMENT_STAFF','WAREHOUSE_KEEPER','WAREHOUSE_MANAGER') NOT NULL,
  `status` enum('ACTIVE','INACTIVE','LOCKED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `department_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `created_at`, `email`, `full_name`, `password`, `role`, `status`, `updated_at`, `department_id`) VALUES
(1, '0000-00-00 00:00:00.000000', 'admin@hospital.vn', 'Nguyễn Văn A', '$2a$12$1Xyb/pZWqtmX76ZfOpRKTOlHO8uxE1zs0UbVSJyyqLq2Dtr7bcP/q', 'ADMIN', 'ACTIVE', '0000-00-00 00:00:00.000000', NULL),
(2, '0000-00-00 00:00:00.000000', 'warehouse@hospital.vn', 'Trần Thị B', '$2a$12$1Xyb/pZWqtmX76ZfOpRKTOlHO8uxE1zs0UbVSJyyqLq2Dtr7bcP/q', 'WAREHOUSE_KEEPER', 'ACTIVE', '0000-00-00 00:00:00.000000', 3),
(3, '0000-00-00 00:00:00.000000', 'accountant@hospital.vn', 'Lê Văn C', '$2a$12$1Xyb/pZWqtmX76ZfOpRKTOlHO8uxE1zs0UbVSJyyqLq2Dtr7bcP/q', 'ACCOUNTANT', 'ACTIVE', '0000-00-00 00:00:00.000000', 4),
(4, '0000-00-00 00:00:00.000000', 'head.nk@hospital.vn', 'Phạm Thị D', '$2a$12$1Xyb/pZWqtmX76ZfOpRKTOlHO8uxE1zs0UbVSJyyqLq2Dtr7bcP/q', 'DEPARTMENT_HEAD', 'ACTIVE', '0000-00-00 00:00:00.000000', 1),
(5, '0000-00-00 00:00:00.000000', 'staff.nh@hospital.vn', 'Hoàng Văn E', '$2a$12$1Xyb/pZWqtmX76ZfOpRKTOlHO8uxE1zs0UbVSJyyqLq2Dtr7bcP/q', 'DEPARTMENT_STAFF', 'ACTIVE', '0000-00-00 00:00:00.000000', 2);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKq8ymhgj6pt1msox0o3bg51uvo` (`code`),
  ADD KEY `FKsayk190ub9j5f0naycjipgbys` (`head_user_id`);

--
-- Chỉ mục cho bảng `goods_receipt`
--
ALTER TABLE `goods_receipt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjmn89x3r3f7l5moab0mb8ni0b` (`finalized_by`),
  ADD KEY `FKafus61e1afenwk9ofh7f4lgye` (`received_by`),
  ADD KEY `FKnekmqp9hg62cijvvhtlouqbtd` (`supplier_id`),
  ADD KEY `FKht2hrt9gao3g8rgi0qnhb5nn2` (`verified_by`);

--
-- Chỉ mục cho bảng `goods_receipt_item`
--
ALTER TABLE `goods_receipt_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4jasj7r9dovy1ra455w8yj523` (`receipt_id`),
  ADD KEY `FKgsem2tmqfproq0f5ryvegudcg` (`material_id`);

--
-- Chỉ mục cho bảng `issue_note`
--
ALTER TABLE `issue_note`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKra9063setvghoyipx87kc3b3f` (`issue_number`),
  ADD UNIQUE KEY `UKveb9mhd3h60i36t3xxl0dh0d` (`requisition_id`),
  ADD KEY `FK1g8i0iguj6kesjf6gg9567sxs` (`issued_by`),
  ADD KEY `FKbwqnlow3ya4x8bnjdbeb18n4s` (`received_by`);

--
-- Chỉ mục cho bảng `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKt9kjl2b3iqg9sv9xe06fcxcya` (`code`);

--
-- Chỉ mục cho bảng `purchase_plan`
--
ALTER TABLE `purchase_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKoohy0gn4e3l47t8o7llx60pvj` (`approved_by`),
  ADD KEY `FKcwblr5o6qoefmeipla9kvrenf` (`created_by`);

--
-- Chỉ mục cho bảng `purchase_plan_item`
--
ALTER TABLE `purchase_plan_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKejmrprqdioubj9iqpo9mc17m7` (`material_id`),
  ADD KEY `FKfr8ugrvcsjkw549u5bttarynl` (`plan_id`);

--
-- Chỉ mục cho bảng `requisition`
--
ALTER TABLE `requisition`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKapymehqstptuk3ap8smqcu0h8` (`requisition_number`),
  ADD KEY `FKj5q1wte7yi810ab8wa0xxh0r0` (`created_by`),
  ADD KEY `FK8uc55eg2932so5v915poa94y1` (`department_id`),
  ADD KEY `FKew8d80guief1n1t1xu6g90mpo` (`verified_by`);

--
-- Chỉ mục cho bảng `requisition_item`
--
ALTER TABLE `requisition_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKsqtv0u1byynkfe6dg65faffe` (`material_id`),
  ADD KEY `FKo48i0qobcf2heq4bqppwcnhv2` (`requisition_id`);

--
-- Chỉ mục cho bảng `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK3xxc7a3oynnijb5gmv4kors17` (`material_id`,`batch_number`);

--
-- Chỉ mục cho bảng `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKu0lh6hby20ok7au7646wrewl` (`code`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  ADD KEY `FKgkh2fko1e4ydv1y6vtrwdc6my` (`department_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `department`
--
ALTER TABLE `department`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `goods_receipt`
--
ALTER TABLE `goods_receipt`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `goods_receipt_item`
--
ALTER TABLE `goods_receipt_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `issue_note`
--
ALTER TABLE `issue_note`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `material`
--
ALTER TABLE `material`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `purchase_plan`
--
ALTER TABLE `purchase_plan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `purchase_plan_item`
--
ALTER TABLE `purchase_plan_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `requisition`
--
ALTER TABLE `requisition`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `requisition_item`
--
ALTER TABLE `requisition_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `stock`
--
ALTER TABLE `stock`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `FKsayk190ub9j5f0naycjipgbys` FOREIGN KEY (`head_user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `goods_receipt`
--
ALTER TABLE `goods_receipt`
  ADD CONSTRAINT `FKafus61e1afenwk9ofh7f4lgye` FOREIGN KEY (`received_by`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKht2hrt9gao3g8rgi0qnhb5nn2` FOREIGN KEY (`verified_by`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKjmn89x3r3f7l5moab0mb8ni0b` FOREIGN KEY (`finalized_by`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKnekmqp9hg62cijvvhtlouqbtd` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`);

--
-- Các ràng buộc cho bảng `goods_receipt_item`
--
ALTER TABLE `goods_receipt_item`
  ADD CONSTRAINT `FK4jasj7r9dovy1ra455w8yj523` FOREIGN KEY (`receipt_id`) REFERENCES `goods_receipt` (`id`),
  ADD CONSTRAINT `FKgsem2tmqfproq0f5ryvegudcg` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`);

--
-- Các ràng buộc cho bảng `issue_note`
--
ALTER TABLE `issue_note`
  ADD CONSTRAINT `FK1g8i0iguj6kesjf6gg9567sxs` FOREIGN KEY (`issued_by`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKbwqnlow3ya4x8bnjdbeb18n4s` FOREIGN KEY (`received_by`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKmqqlv3ir5moqq5imkg85ssgn` FOREIGN KEY (`requisition_id`) REFERENCES `requisition` (`id`);

--
-- Các ràng buộc cho bảng `purchase_plan`
--
ALTER TABLE `purchase_plan`
  ADD CONSTRAINT `FKcwblr5o6qoefmeipla9kvrenf` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKoohy0gn4e3l47t8o7llx60pvj` FOREIGN KEY (`approved_by`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `purchase_plan_item`
--
ALTER TABLE `purchase_plan_item`
  ADD CONSTRAINT `FKejmrprqdioubj9iqpo9mc17m7` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  ADD CONSTRAINT `FKfr8ugrvcsjkw549u5bttarynl` FOREIGN KEY (`plan_id`) REFERENCES `purchase_plan` (`id`);

--
-- Các ràng buộc cho bảng `requisition`
--
ALTER TABLE `requisition`
  ADD CONSTRAINT `FK8uc55eg2932so5v915poa94y1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`),
  ADD CONSTRAINT `FKew8d80guief1n1t1xu6g90mpo` FOREIGN KEY (`verified_by`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKj5q1wte7yi810ab8wa0xxh0r0` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `requisition_item`
--
ALTER TABLE `requisition_item`
  ADD CONSTRAINT `FKo48i0qobcf2heq4bqppwcnhv2` FOREIGN KEY (`requisition_id`) REFERENCES `requisition` (`id`),
  ADD CONSTRAINT `FKsqtv0u1byynkfe6dg65faffe` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`);

--
-- Các ràng buộc cho bảng `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `FKf123dh2wb06h2d6fmq4v459sg` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`);

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FKgkh2fko1e4ydv1y6vtrwdc6my` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
