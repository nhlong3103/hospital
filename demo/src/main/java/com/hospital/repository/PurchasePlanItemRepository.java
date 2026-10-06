package com.hospital.repository;

import com.hospital.entity.PurchasePlanItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchasePlanItemRepository extends JpaRepository<PurchasePlanItem, Long> {
    
    List<PurchasePlanItem> findByPurchasePlanId(Long planId);
    
    List<PurchasePlanItem> findByMaterialId(Long materialId);
}
