package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGoodsReceiptRequest {
    
    @NotNull(message = "Ngày nhập không được để trống")
    private LocalDate receiptDate;
    
    @NotNull(message = "Supplier ID không được để trống")
    private Long supplierId;
    
    @NotBlank(message = "Số hóa đơn không được để trống")
    private String invoiceNumber;

    @NotEmpty(message = "Danh sách vật tư không được để trống")
    @Valid
    private List<GoodsReceiptItemDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoodsReceiptItemDTO {
        
        @NotNull(message = "Material ID không được để trống")
        private Long materialId;
        
        @NotNull(message = "Số lượng nhập không được để trống")
        private Integer quantity;
        
        @NotNull(message = "Đơn giá không được để trống")
        private BigDecimal unitPrice;
        
        @NotBlank(message = "Số lô không được để trống")
        private String batchNumber;
        
        private LocalDate expiryDate;
    }
}
