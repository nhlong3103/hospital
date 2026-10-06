package com.hospital.exception;

public class InsufficientStockException extends BusinessException {
    
    public InsufficientStockException(String materialName, Integer required, Integer available) {
        super(String.format("Không đủ tồn kho cho vật tư '%s'. Yêu cầu: %d, Có sẵn: %d", 
            materialName, required, available));
    }
    
    public InsufficientStockException(String message) {
        super(message);
    }
}
