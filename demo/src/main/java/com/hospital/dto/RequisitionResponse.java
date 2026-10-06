package com.hospital.dto;

import com.hospital.enums.RequisitionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequisitionResponse {
    
    private Long id;
    private String requisitionNumber;
    private LocalDate requisitionDate;
    private RequisitionStatus status;
    
    private Long departmentId;
    private String departmentName;
    
    private Long createdById;
    private String createdByName;
    
    private Long verifiedById;
    private String verifiedByName;
    
    private List<RequisitionItemResponse> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequisitionItemResponse {
        private Long id;
        private Long materialId;
        private String materialCode;
        private String materialName;
        private String materialUnit;
        private Integer requestedQuantity;
        private Integer issuedQuantity;
    }
}
