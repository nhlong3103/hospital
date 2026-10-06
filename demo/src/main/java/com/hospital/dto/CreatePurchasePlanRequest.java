package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePurchasePlanRequest {

    @NotNull(message = "Ngày lập kế hoạch không được để trống")
    private LocalDate planDate;

    private String notes;

    @NotEmpty(message = "Danh sách vật tư không được để trống")
    @Valid
    private List<PurchasePlanItemDTO> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchasePlanItemDTO {

        @NotNull(message = "Material ID không được để trống")
        private Long materialId;

        @NotNull(message = "Số lượng đề xuất không được để trống")
        @Min(value = 1, message = "Số lượng đề xuất phải lớn hơn 0")
        private Integer requestedQuantity;

        private BigDecimal estimatedPrice;
    }
}
