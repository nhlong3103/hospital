package com.hospital.enums;

public enum RequisitionStatus {
    DRAFT("Bản nháp"),
    PENDING("Chờ xác nhận"),
    VERIFIED("Đã xác nhận (Thủ kho)"),
    APPROVED("Đã duyệt (Trưởng khoa)"),
    ISSUED("Đã xuất kho"),
    REJECTED("Từ chối");
    
    private final String description;
    
    RequisitionStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
