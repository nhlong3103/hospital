package com.hospital.repository;

import com.hospital.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    
    List<Stock> findByMaterialId(Long materialId);
    
    Optional<Stock> findByMaterialIdAndBatchNumber(Long materialId, String batchNumber);
    
    @Query("SELECT s FROM Stock s WHERE s.material.id = :materialId AND s.quantity > 0 " +
           "AND (s.expiryDate IS NULL OR s.expiryDate >= :today) " +
           "ORDER BY CASE WHEN s.expiryDate IS NULL THEN 1 ELSE 0 END, s.expiryDate ASC, s.createdAt ASC")
    List<Stock> findAvailableStockByMaterialIdOrderByFIFO(@Param("materialId") Long materialId,
                                                          @Param("today") LocalDate today);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Stock s WHERE s.material.id = :materialId")
    Integer getTotalQuantityByMaterialId(@Param("materialId") Long materialId);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Stock s WHERE s.material.id = :materialId " +
           "AND (s.expiryDate IS NULL OR s.expiryDate >= :today)")
    Integer getAvailableQuantityByMaterialId(@Param("materialId") Long materialId,
                                             @Param("today") LocalDate today);
    
    @Query("SELECT s FROM Stock s WHERE s.expiryDate <= :date AND s.quantity > 0")
    List<Stock> findStockExpiringSoon(@Param("date") LocalDate date);
    
    @Query("SELECT s FROM Stock s WHERE s.quantity < :threshold")
    List<Stock> findLowStockItems(@Param("threshold") Integer threshold);
}
