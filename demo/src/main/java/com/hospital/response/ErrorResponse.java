package com.hospital.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    
    private boolean success = false;
    private String message;
    private String error;
    private int status;
    private String path;
    private LocalDateTime timestamp;
    private List<String> errors;
    
    public ErrorResponse(String message, String error, int status, String path) {
        this.success = false;
        this.message = message;
        this.error = error;
        this.status = status;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}
