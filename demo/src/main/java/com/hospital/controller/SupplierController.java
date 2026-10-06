package com.hospital.controller;

import com.hospital.entity.Supplier;
import com.hospital.response.ApiResponse;
import com.hospital.service.SupplierService;
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

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Supplier Management", description = "APIs quản lý nhà cung cấp")
public class SupplierController {
    
    private final SupplierService supplierService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Tạo nhà cung cấp mới")
    public ResponseEntity<ApiResponse<Supplier>> createSupplier(
            @Valid @RequestBody Supplier supplier) {
        
        log.info("Creating new supplier: {}", supplier.getCode());
        
        Supplier created = supplierService.createSupplier(supplier);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo nhà cung cấp thành công", created));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Cập nhật thông tin nhà cung cấp")
    public ResponseEntity<ApiResponse<Supplier>> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody Supplier supplier) {
        
        log.info("Updating supplier: {}", id);
        
        Supplier updated = supplierService.updateSupplier(id, supplier);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nhà cung cấp thành công", updated));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin nhà cung cấp theo ID")
    public ResponseEntity<ApiResponse<Supplier>> getSupplier(@PathVariable Long id) {
        
        log.info("Getting supplier: {}", id);
        
        Supplier supplier = supplierService.getSupplierById(id);
        
        return ResponseEntity.ok(ApiResponse.success(supplier));
    }
    
    @GetMapping("/code/{code}")
    @Operation(summary = "Lấy thông tin nhà cung cấp theo mã")
    public ResponseEntity<ApiResponse<Supplier>> getSupplierByCode(@PathVariable String code) {
        
        log.info("Getting supplier by code: {}", code);
        
        Supplier supplier = supplierService.getSupplierByCode(code);
        
        return ResponseEntity.ok(ApiResponse.success(supplier));
    }
    
    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả nhà cung cấp")
    public ResponseEntity<ApiResponse<List<Supplier>>> getAllSuppliers() {
        
        log.info("Getting all suppliers");
        
        List<Supplier> suppliers = supplierService.getAllSuppliers();
        
        return ResponseEntity.ok(ApiResponse.success(suppliers));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm nhà cung cấp theo tên")
    public ResponseEntity<ApiResponse<List<Supplier>>> searchSuppliers(
            @RequestParam String name) {
        
        log.info("Searching suppliers by name: {}", name);
        
        List<Supplier> suppliers = supplierService.searchSuppliersByName(name);
        
        return ResponseEntity.ok(ApiResponse.success(suppliers));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Xóa nhà cung cấp")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(@PathVariable Long id) {
        
        log.info("Deleting supplier: {}", id);
        
        supplierService.deleteSupplier(id);
        
        return ResponseEntity.ok(ApiResponse.success("Xóa nhà cung cấp thành công", null));
    }
}
