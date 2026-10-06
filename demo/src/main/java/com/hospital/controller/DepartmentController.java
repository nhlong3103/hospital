package com.hospital.controller;

import com.hospital.dto.DepartmentDTO;
import com.hospital.entity.Department;
import com.hospital.response.ApiResponse;
import com.hospital.service.DepartmentService;
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
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Department Management", description = "APIs quản lý khoa/phòng")
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo khoa/phòng mới")
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(
            @Valid @RequestBody DepartmentDTO dto) {

        log.info("Creating new department: {}", dto.getCode());

        Department created = departmentService.createDepartment(convertToEntity(dto));

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo khoa/phòng thành công", convertToDTO(created)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật thông tin khoa/phòng")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentDTO dto) {

        log.info("Updating department: {}", id);

        Department updated = departmentService.updateDepartment(id, convertToEntity(dto));

        return ResponseEntity.ok(ApiResponse.success(
            "Cập nhật khoa/phòng thành công", convertToDTO(updated)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin khoa/phòng theo ID")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartment(@PathVariable Long id) {

        log.info("Getting department: {}", id);

        Department department = departmentService.getDepartmentById(id);

        return ResponseEntity.ok(ApiResponse.success(convertToDTO(department)));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Lấy thông tin khoa/phòng theo mã")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentByCode(@PathVariable String code) {

        log.info("Getting department by code: {}", code);

        Department department = departmentService.getDepartmentByCode(code);

        return ResponseEntity.ok(ApiResponse.success(convertToDTO(department)));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả khoa/phòng")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {

        log.info("Getting all departments");

        List<DepartmentDTO> departments = departmentService.getAllDepartments().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @PatchMapping("/{departmentId}/head/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Gán trưởng khoa/phòng")
    public ResponseEntity<ApiResponse<DepartmentDTO>> assignHead(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {

        log.info("Assigning head for department {}: user {}", departmentId, userId);

        Department department = departmentService.assignHead(departmentId, userId);

        return ResponseEntity.ok(ApiResponse.success(
            "Gán trưởng khoa/phòng thành công", convertToDTO(department)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa khoa/phòng")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {

        log.info("Deleting department: {}", id);

        departmentService.deleteDepartment(id);

        return ResponseEntity.ok(ApiResponse.success("Xóa khoa/phòng thành công", null));
    }

    private Department convertToEntity(DepartmentDTO dto) {
        Department department = new Department();
        department.setId(dto.getId());
        department.setCode(dto.getCode());
        department.setName(dto.getName());
        department.setPhoneNumber(dto.getPhoneNumber());
        return department;
    }

    private DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setCode(department.getCode());
        dto.setName(department.getName());
        dto.setPhoneNumber(department.getPhoneNumber());

        if (department.getHeadUser() != null) {
            dto.setHeadUserId(department.getHeadUser().getId());
            dto.setHeadUserName(department.getHeadUser().getFullName());
        }

        return dto;
    }
}
