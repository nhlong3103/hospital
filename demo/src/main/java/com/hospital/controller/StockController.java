package com.hospital.controller;

import com.hospital.entity.Stock;
import com.hospital.response.ApiResponse;
import com.hospital.service.StockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stocks")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Stock Management", description = "APIs quản lý tồn kho")
public class StockController {
    
    private final StockService stockService;
    
    @GetMapping("/material/{materialId}")
    @Operation(summary = "Lấy tồn kho theo vật tư (theo từng lô)")
    public ResponseEntity<ApiResponse<List<Stock>>> getStocksByMaterial(
            @PathVariable Long materialId) {
        
        log.info("Getting stocks for material: {}", materialId);
        
        List<Stock> stocks = stockService.getStocksByMaterialId(materialId);
        
        return ResponseEntity.ok(ApiResponse.success(stocks));
    }
    
    @GetMapping("/material/{materialId}/total")
    @Operation(summary = "Lấy tổng số lượng tồn của vật tư")
    public ResponseEntity<ApiResponse<Integer>> getTotalStock(@PathVariable Long materialId) {
        
        log.info("Getting total stock for material: {}", materialId);
        
        Integer totalStock = stockService.getTotalQuantityByMaterialId(materialId);
        
        return ResponseEntity.ok(ApiResponse.success(totalStock));
    }
    
    @GetMapping("/expiring-soon")
    @Operation(summary = "Lấy danh sách tồn kho sắp hết hạn")
    public ResponseEntity<ApiResponse<List<Stock>>> getStockExpiringSoon(
            @RequestParam(defaultValue = "30") Integer daysThreshold) {
        
        log.info("Getting stocks expiring in {} days", daysThreshold);
        
        List<Stock> stocks = stockService.getStockExpiringSoon(daysThreshold);
        
        return ResponseEntity.ok(ApiResponse.success(stocks));
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Lấy danh sách vật tư sắp hết (dưới ngưỡng)")
    public ResponseEntity<ApiResponse<List<Stock>>> getLowStockItems(
            @RequestParam(defaultValue = "10") Integer threshold) {
        
        log.info("Getting low stock items with threshold: {}", threshold);
        
        List<Stock> stocks = stockService.getLowStockItems(threshold);
        
        return ResponseEntity.ok(ApiResponse.success(stocks));
    }
    
    @GetMapping("/check-availability")
    @Operation(summary = "Kiểm tra xem có đủ tồn kho không")
    public ResponseEntity<ApiResponse<Boolean>> checkStockAvailability(
            @RequestParam Long materialId,
            @RequestParam Integer requiredQuantity) {
        
        log.info("Checking stock availability for material {} with quantity {}", 
            materialId, requiredQuantity);
        
        boolean available = stockService.isStockAvailable(materialId, requiredQuantity);
        
        return ResponseEntity.ok(ApiResponse.success(available));
    }
    
    @PatchMapping("/{stockId}/location")
    @PreAuthorize("hasAnyRole('WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Cập nhật vị trí lưu kho")
    public ResponseEntity<ApiResponse<Stock>> updateStorageLocation(
            @PathVariable Long stockId,
            @RequestParam String location) {
        
        log.info("Updating storage location for stock {}: {}", stockId, location);
        
        Stock updated = stockService.updateStorageLocation(stockId, location);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật vị trí thành công", updated));
    }
}
