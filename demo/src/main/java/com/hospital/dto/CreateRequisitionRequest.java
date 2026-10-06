package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRequisitionRequest {
    
    @NotNull(message = "Department ID không được để trống")
    private Long departmentId;

    @NotNull(message = "Ngày lập phiếu không được để trống")
    private LocalDate requisitionDate;
    
    @NotEmpty(message = "Danh sách vật tư không được để trống")
    @Valid
    private List<RequisitionItemDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequisitionItemDTO {
        
        @NotNull(message = "Material ID không được để trống")
        private Long materialId;
        
        @NotNull(message = "Số lượng yêu cầu không được để trống")
        private Integer requestedQuantity;
    }
}
