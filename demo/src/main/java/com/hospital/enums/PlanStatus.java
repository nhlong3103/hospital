package com.hospital.enums;

public enum PlanStatus {
    DRAFT("Bản nháp"),
    PENDING("Chờ duyệt"),
    APPROVED("Đã duyệt"),
    REJECTED("Từ chối"),
    COMPLETED("Hoàn thành");
    
    private final String description;
    
    PlanStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
