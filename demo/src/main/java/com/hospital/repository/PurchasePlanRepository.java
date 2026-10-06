package com.hospital.repository;

import com.hospital.entity.PurchasePlan;
import com.hospital.enums.PlanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchasePlanRepository extends JpaRepository<PurchasePlan, Long> {
    
    List<PurchasePlan> findByStatus(PlanStatus status);
    
    List<PurchasePlan> findByCreatedById(Long userId);
    
    List<PurchasePlan> findByPlanDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<PurchasePlan> findByStatusOrderByPlanDateDesc(PlanStatus status);
}
