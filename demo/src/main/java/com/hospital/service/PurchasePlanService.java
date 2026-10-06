package com.hospital.service;

import com.hospital.entity.PurchasePlan;
import com.hospital.entity.PurchasePlanItem;
import com.hospital.enums.PlanStatus;

import java.time.LocalDate;
import java.util.List;

public interface PurchasePlanService {
    
    PurchasePlan createPurchasePlan(PurchasePlan plan, List<PurchasePlanItem> items);
    
    PurchasePlan updatePurchasePlan(Long id, PurchasePlan plan, List<PurchasePlanItem> items);
    
    PurchasePlan getPurchasePlanById(Long id);
    
    List<PurchasePlan> getAllPurchasePlans();
    
    List<PurchasePlan> getPurchasePlansByStatus(PlanStatus status);
    
    List<PurchasePlan> getPurchasePlansByCreatedBy(Long userId);
    
    List<PurchasePlan> getPurchasePlansByDateRange(LocalDate startDate, LocalDate endDate);
    
    PurchasePlan submitForApproval(Long planId);
    
    PurchasePlan approvePlan(Long planId, Long approvedByUserId);
    
    PurchasePlan rejectPlan(Long planId, Long approvedByUserId, String reason);
    
    PurchasePlan completePlan(Long planId);
    
    Integer calculateRecommendedQuantity(Long materialId);
    
    void deletePurchasePlan(Long id);
}
