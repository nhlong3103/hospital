package com.hospital.dto;

import com.hospital.enums.PlanStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchasePlanResponse {

    private Long id;
    private LocalDate planDate;
    private PlanStatus status;
    private String notes;

    private Long createdById;
    private String createdByName;

    private Long approvedById;
    private String approvedByName;

    private BigDecimal totalEstimatedAmount;

    private List<PurchasePlanItemResponse> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchasePlanItemResponse {
        private Long id;
        private Long materialId;
        private String materialCode;
        private String materialName;
        private String materialUnit;
        private Integer requestedQuantity;
        private BigDecimal estimatedPrice;
        private BigDecimal estimatedAmount;
    }
}
