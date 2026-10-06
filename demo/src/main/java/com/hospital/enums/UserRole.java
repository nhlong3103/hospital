package com.hospital.enums;

public enum UserRole {
    ADMIN("Quản trị viên"),
    WAREHOUSE_KEEPER("Thủ kho"),
    DEPARTMENT_HEAD("Trưởng khoa/phòng"),
    DEPARTMENT_STAFF("Nhân viên khoa/phòng (ĐD/KTV)"),
    WAREHOUSE_MANAGER("Trưởng phòng VTTBYT"),
    ACCOUNTANT("Kế toán (P.TCKT)");
    
    private final String description;
    
    UserRole(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
