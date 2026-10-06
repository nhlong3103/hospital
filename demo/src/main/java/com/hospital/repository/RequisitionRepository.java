package com.hospital.repository;

import com.hospital.entity.Requisition;
import com.hospital.enums.RequisitionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RequisitionRepository extends JpaRepository<Requisition, Long> {
    
    Optional<Requisition> findByRequisitionNumber(String requisitionNumber);
    
    List<Requisition> findByStatus(RequisitionStatus status);
    
    List<Requisition> findByDepartmentId(Long departmentId);
    
    List<Requisition> findByCreatedById(Long userId);
    
    List<Requisition> findByRequisitionDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Requisition> findByStatusOrderByRequisitionDateDesc(RequisitionStatus status);
    
    List<Requisition> findByDepartmentIdAndStatus(Long departmentId, RequisitionStatus status);
}
