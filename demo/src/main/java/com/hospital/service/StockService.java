package com.hospital.service;

import com.hospital.entity.Stock;

import java.time.LocalDate;
import java.util.List;

public interface StockService {
    
    Stock addStock(Long materialId, String batchNumber, Integer quantity, 
                   LocalDate expiryDate, String storageLocation);
    
    void reduceStock(Long materialId, Integer quantity);

    Integer getTotalQuantityByMaterialId(Long materialId);

    Integer getAvailableQuantityByMaterialId(Long materialId);
    
    List<Stock> getStocksByMaterialId(Long materialId);
    
    List<Stock> getStockExpiringSoon(Integer daysThreshold);
    
    List<Stock> getLowStockItems(Integer threshold);
    
    boolean isStockAvailable(Long materialId, Integer requiredQuantity);
    
    Stock updateStorageLocation(Long stockId, String newLocation);
}
