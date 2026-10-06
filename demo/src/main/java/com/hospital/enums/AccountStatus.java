package com.hospital.enums;

public enum AccountStatus {
    ACTIVE("Đang hoạt động"),
    INACTIVE("Không hoạt động"),
    LOCKED("Bị khóa");
    
    private final String description;
    
    AccountStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
