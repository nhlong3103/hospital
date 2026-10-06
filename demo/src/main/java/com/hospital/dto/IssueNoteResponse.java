package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueNoteResponse {

    private Long id;
    private String issueNumber;
    private LocalDate issueDate;

    private Long requisitionId;
    private String requisitionNumber;
    private Long departmentId;
    private String departmentName;

    private Long issuedById;
    private String issuedByName;

    private Long receivedById;
    private String receivedByName;

    private List<IssueNoteItemResponse> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IssueNoteItemResponse {
        private Long materialId;
        private String materialCode;
        private String materialName;
        private String materialUnit;
        private Integer quantity;
    }
}
