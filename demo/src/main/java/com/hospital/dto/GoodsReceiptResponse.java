package com.hospital.dto;

import com.hospital.enums.ReceiptStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptResponse {

    private Long id;
    private LocalDate receiptDate;
    private String invoiceNumber;
    private ReceiptStatus status;

    private Long supplierId;
    private String supplierName;

    private Long receivedById;
    private String receivedByName;

    private Long verifiedById;
    private String verifiedByName;

    private Long finalizedById;
    private String finalizedByName;

    private BigDecimal totalAmount;

    private List<GoodsReceiptItemResponse> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoodsReceiptItemResponse {
        private Long id;
        private Long materialId;
        private String materialCode;
        private String materialName;
        private String materialUnit;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal amount;
        private String batchNumber;
        private LocalDate expiryDate;
    }
}
