package com.hospital.repository;

import com.hospital.entity.GoodsReceipt;
import com.hospital.enums.ReceiptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, Long> {
    
    List<GoodsReceipt> findByStatus(ReceiptStatus status);
    
    List<GoodsReceipt> findBySupplierId(Long supplierId);
    
    Optional<GoodsReceipt> findByInvoiceNumber(String invoiceNumber);
    
    List<GoodsReceipt> findByReceiptDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<GoodsReceipt> findByReceivedById(Long userId);
    
    List<GoodsReceipt> findByStatusOrderByReceiptDateDesc(ReceiptStatus status);
}
