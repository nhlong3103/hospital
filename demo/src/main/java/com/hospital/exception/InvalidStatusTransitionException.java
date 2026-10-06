package com.hospital.exception;

public class InvalidStatusTransitionException extends BusinessException {
    
    public InvalidStatusTransitionException(String currentStatus, String targetStatus) {
        super(String.format("Không thể chuyển từ trạng thái '%s' sang '%s'", currentStatus, targetStatus));
    }
    
    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}
