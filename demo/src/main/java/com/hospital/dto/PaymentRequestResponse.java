package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestResponse {

    private Long receiptId;
    private LocalDate requestDate;

    private String invoiceNumber;
    private LocalDate receiptDate;

    private String supplierCode;
    private String supplierName;
    private String supplierAddress;
    private String supplierPhoneNumber;

    private String preparedByName;
    private String finalizedByName;

    private BigDecimal totalAmount;

    private List<GoodsReceiptResponse.GoodsReceiptItemResponse> items;
}
