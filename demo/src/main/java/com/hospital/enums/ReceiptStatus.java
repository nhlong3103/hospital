package com.hospital.enums;

public enum ReceiptStatus {
    DRAFT("Bản nháp"),
    RECEIVED("Đã nhận hàng"),
    VERIFIED("Đã kiểm tra"),
    FINALIZED("Đã hoàn tất");
    
    private final String description;
    
    ReceiptStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
