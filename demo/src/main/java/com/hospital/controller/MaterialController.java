package com.hospital.controller;

import com.hospital.dto.MaterialDTO;
import com.hospital.entity.Material;
import com.hospital.response.ApiResponse;
import com.hospital.service.MaterialService;
import com.hospital.service.StockService;
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
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Material Management", description = "APIs quản lý vật tư y tế")
public class MaterialController {
    
    private final MaterialService materialService;
    private final StockService stockService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Tạo vật tư mới")
    public ResponseEntity<ApiResponse<MaterialDTO>> createMaterial(
            @Valid @RequestBody MaterialDTO dto) {
        
        log.info("Creating new material: {}", dto.getCode());
        
        Material material = convertToEntity(dto);
        Material created = materialService.createMaterial(material);
        MaterialDTO response = convertToDTO(created);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo vật tư thành công", response));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Cập nhật vật tư")
    public ResponseEntity<ApiResponse<MaterialDTO>> updateMaterial(
            @PathVariable Long id,
            @Valid @RequestBody MaterialDTO dto) {
        
        log.info("Updating material: {}", id);
        
        Material material = convertToEntity(dto);
        Material updated = materialService.updateMaterial(id, material);
        MaterialDTO response = convertToDTO(updated);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật vật tư thành công", response));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin vật tư theo ID")
    public ResponseEntity<ApiResponse<MaterialDTO>> getMaterial(@PathVariable Long id) {
        
        log.info("Getting material: {}", id);
        
        Material material = materialService.getMaterialById(id);
        MaterialDTO response = convertToDTO(material);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả vật tư")
    public ResponseEntity<ApiResponse<List<MaterialDTO>>> getAllMaterials() {
        
        log.info("Getting all materials");
        
        List<MaterialDTO> materials = materialService.getAllMaterials().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(materials));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm vật tư theo tên")
    public ResponseEntity<ApiResponse<List<MaterialDTO>>> searchMaterials(
            @RequestParam String name) {
        
        log.info("Searching materials by name: {}", name);
        
        List<MaterialDTO> materials = materialService.searchMaterialsByName(name).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(materials));
    }
    
    @GetMapping("/category/{category}")
    @Operation(summary = "Lấy vật tư theo loại")
    public ResponseEntity<ApiResponse<List<MaterialDTO>>> getMaterialsByCategory(
            @PathVariable String category) {
        
        log.info("Getting materials by category: {}", category);
        
        List<MaterialDTO> materials = materialService.getMaterialsByCategory(category).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(materials));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Xóa vật tư")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(@PathVariable Long id) {
        
        log.info("Deleting material: {}", id);
        
        materialService.deleteMaterial(id);
        
        return ResponseEntity.ok(ApiResponse.success("Xóa vật tư thành công", null));
    }
    
    private Material convertToEntity(MaterialDTO dto) {
        Material material = new Material();
        material.setId(dto.getId());
        material.setCode(dto.getCode());
        material.setName(dto.getName());
        material.setUnit(dto.getUnit());
        material.setManufacturer(dto.getManufacturer());
        material.setCategory(dto.getCategory());
        return material;
    }
    
    private MaterialDTO convertToDTO(Material material) {
        MaterialDTO dto = new MaterialDTO();
        dto.setId(material.getId());
        dto.setCode(material.getCode());
        dto.setName(material.getName());
        dto.setUnit(material.getUnit());
        dto.setManufacturer(material.getManufacturer());
        dto.setCategory(material.getCategory());
        
        dto.setTotalStock(stockService.getTotalQuantityByMaterialId(material.getId()));
        
        return dto;
    }
}
