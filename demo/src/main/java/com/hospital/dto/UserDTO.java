package com.hospital.dto;

import com.hospital.enums.AccountStatus;
import com.hospital.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    private Long id;
    
    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 200, message = "Họ tên không được vượt quá 200 ký tự")
    private String fullName;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;
    
    @NotNull(message = "Vai trò không được để trống")
    private UserRole role;
    
    private Long departmentId;
    private String departmentName;
    
    private AccountStatus status;
    
}
