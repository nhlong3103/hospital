package com.hospital.controller;

import com.hospital.dto.CreateUserRequest;
import com.hospital.dto.UserDTO;
import com.hospital.entity.User;
import com.hospital.enums.AccountStatus;
import com.hospital.enums.UserRole;
import com.hospital.exception.BusinessException;
import com.hospital.response.ApiResponse;
import com.hospital.service.DepartmentService;
import com.hospital.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User Management", description = "APIs quản lý người dùng")
public class UserController {
    
    private final UserService userService;
    private final DepartmentService departmentService;
    
    @PostMapping
    @Operation(summary = "Tạo người dùng mới")
    public ResponseEntity<ApiResponse<UserDTO>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        
        log.info("Creating new user: {}", request.getEmail());
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setStatus(AccountStatus.ACTIVE);
        
        if (request.getDepartmentId() != null) {
            user.setDepartment(departmentService.getDepartmentById(request.getDepartmentId()));
        }
        
        User created = userService.createUser(user);
        UserDTO response = convertToDTO(created);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo người dùng thành công", response));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin người dùng")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO dto) {
        
        log.info("Updating user: {}", id);
        
        User user = userService.getUserById(id);
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        
        if (dto.getDepartmentId() != null) {
            user.setDepartment(departmentService.getDepartmentById(dto.getDepartmentId()));
        }
        
        User updated = userService.updateUser(id, user);
        UserDTO response = convertToDTO(updated);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật người dùng thành công", response));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin người dùng theo ID")
    public ResponseEntity<ApiResponse<UserDTO>> getUser(@PathVariable Long id) {
        
        log.info("Getting user: {}", id);
        
        User user = userService.getUserById(id);
        UserDTO response = convertToDTO(user);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/email/{email}")
    @Operation(summary = "Lấy thông tin người dùng theo email")
    public ResponseEntity<ApiResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        
        log.info("Getting user by email: {}", email);
        
        User user = userService.getUserByEmail(email);
        UserDTO response = convertToDTO(user);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả người dùng")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) Long departmentId) {
        
        log.info("Getting all users with role: {}, departmentId: {}", role, departmentId);
        
        List<User> users;
        
        if (role != null) {
            users = userService.getUsersByRole(role);
        } else if (departmentId != null) {
            users = userService.getUsersByDepartment(departmentId);
        } else {
            users = userService.getAllUsers();
        }
        
        List<UserDTO> response = users.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái tài khoản (khóa/mở khóa)")
    public ResponseEntity<ApiResponse<UserDTO>> updateAccountStatus(
            @PathVariable Long id,
            @RequestParam AccountStatus status) {
        
        log.info("Updating account status for user {}: {}", id, status);
        
        User user = userService.updateAccountStatus(id, status);
        UserDTO response = convertToDTO(user);
        
        return ResponseEntity.ok(ApiResponse.success(
            "Cập nhật trạng thái tài khoản thành công", response));
    }
    
    @PostMapping("/{id}/change-password")
    @PreAuthorize("#id == principal.id")
    @Operation(summary = "Đổi mật khẩu (chỉ đổi mật khẩu của chính mình)")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable Long id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {

        log.info("Changing password for user: {}", id);

        userService.changePassword(id, oldPassword, newPassword);

        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping("/{id}/reset-password")
    @Operation(summary = "Admin đặt lại mật khẩu cho người dùng")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @PathVariable Long id,
            @RequestParam String newPassword) {

        log.info("Resetting password for user: {}", id);

        if (newPassword == null || newPassword.length() < 6) {
            throw new BusinessException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        userService.resetPassword(id, newPassword);

        return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công", null));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa người dùng")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        
        log.info("Deleting user: {}", id);
        
        userService.deleteUser(id);
        
        return ResponseEntity.ok(ApiResponse.success("Xóa người dùng thành công", null));
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
        }
        
        return dto;
    }
}
