package com.hospital.service.impl;

import com.hospital.entity.Material;
import com.hospital.entity.Stock;
import com.hospital.exception.InsufficientStockException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MaterialRepository;
import com.hospital.repository.StockRepository;
import com.hospital.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StockServiceImpl implements StockService {
    
    private final StockRepository stockRepository;
    private final MaterialRepository materialRepository;
    
    @Override
    public Stock addStock(Long materialId, String batchNumber, Integer quantity, 
                         LocalDate expiryDate, String storageLocation) {
        log.info("Adding stock for material {}, batch {}, quantity {}", 
            materialId, batchNumber, quantity);
        
        Material material = materialRepository.findById(materialId)
            .orElseThrow(() -> new ResourceNotFoundException("Material", "id", materialId));
        
        Stock stock = stockRepository.findByMaterialIdAndBatchNumber(materialId, batchNumber)
            .orElse(null);
        
        if (stock != null) {
            log.info("Stock already exists, adding quantity to existing stock");
            stock.setQuantity(stock.getQuantity() + quantity);
            
            if (expiryDate != null) {
                stock.setExpiryDate(expiryDate);
            }
            if (storageLocation != null) {
                stock.setStorageLocation(storageLocation);
            }
        } else {
            log.info("Creating new stock entry");
            stock = new Stock();
            stock.setMaterial(material);
            stock.setBatchNumber(batchNumber);
            stock.setQuantity(quantity);
            stock.setExpiryDate(expiryDate);
            stock.setStorageLocation(storageLocation);
        }
        
        return stockRepository.save(stock);
    }
    
    @Override
    public void reduceStock(Long materialId, Integer quantity) {
        log.info("Reducing stock for material {}, quantity {}", materialId, quantity);
        
        if (!isStockAvailable(materialId, quantity)) {
            Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", materialId));
            Integer available = getAvailableQuantityByMaterialId(materialId);
            throw new InsufficientStockException(material.getName(), quantity, available);
        }

        List<Stock> availableStocks = stockRepository
            .findAvailableStockByMaterialIdOrderByFIFO(materialId, LocalDate.now());
        
        Integer remainingQuantity = quantity;
        
        for (Stock stock : availableStocks) {
            if (remainingQuantity <= 0) {
                break;
            }
            
            Integer stockQuantity = stock.getQuantity();
            
            if (stockQuantity >= remainingQuantity) {
                log.info("Taking {} from stock id {} (batch {})", 
                    remainingQuantity, stock.getId(), stock.getBatchNumber());
                stock.setQuantity(stockQuantity - remainingQuantity);
                remainingQuantity = 0;
            } else {
                log.info("Taking all {} from stock id {} (batch {})", 
                    stockQuantity, stock.getId(), stock.getBatchNumber());
                stock.setQuantity(0);
                remainingQuantity -= stockQuantity;
            }
            
            stockRepository.save(stock);
        }
        
        if (remainingQuantity > 0) {
            throw new InsufficientStockException(
                "Lỗi logic: Vẫn còn thiếu " + remainingQuantity + " sau khi xuất kho");
        }
        
        log.info("Successfully reduced stock for material {}", materialId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer getTotalQuantityByMaterialId(Long materialId) {
        Integer total = stockRepository.getTotalQuantityByMaterialId(materialId);
        return total != null ? total : 0;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer getAvailableQuantityByMaterialId(Long materialId) {
        Integer total = stockRepository.getAvailableQuantityByMaterialId(materialId, LocalDate.now());
        return total != null ? total : 0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Stock> getStocksByMaterialId(Long materialId) {
        return stockRepository.findByMaterialId(materialId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Stock> getStockExpiringSoon(Integer daysThreshold) {
        LocalDate thresholdDate = LocalDate.now().plusDays(daysThreshold);
        return stockRepository.findStockExpiringSoon(thresholdDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Stock> getLowStockItems(Integer threshold) {
        return stockRepository.findLowStockItems(threshold);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isStockAvailable(Long materialId, Integer requiredQuantity) {
        Integer availableQuantity = getAvailableQuantityByMaterialId(materialId);
        return availableQuantity >= requiredQuantity;
    }
    
    @Override
    public Stock updateStorageLocation(Long stockId, String newLocation) {
        log.info("Updating storage location for stock {}", stockId);
        
        Stock stock = stockRepository.findById(stockId)
            .orElseThrow(() -> new ResourceNotFoundException("Stock", "id", stockId));
        
        stock.setStorageLocation(newLocation);
        return stockRepository.save(stock);
    }
}
