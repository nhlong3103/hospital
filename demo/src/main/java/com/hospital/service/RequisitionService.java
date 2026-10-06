package com.hospital.service;

import com.hospital.entity.Requisition;
import com.hospital.entity.RequisitionItem;
import com.hospital.enums.RequisitionStatus;

import java.time.LocalDate;
import java.util.List;

public interface RequisitionService {
    
    Requisition createRequisition(Requisition requisition, List<RequisitionItem> items);
    
    Requisition updateRequisition(Long id, Requisition requisition, List<RequisitionItem> items);
    
    Requisition getRequisitionById(Long id);
    
    Requisition getRequisitionByNumber(String requisitionNumber);
    
    List<Requisition> getAllRequisitions();
    
    List<Requisition> getRequisitionsByStatus(RequisitionStatus status);
    
    List<Requisition> getRequisitionsByDepartment(Long departmentId);
    
    List<Requisition> getRequisitionsByCreatedBy(Long userId);
    
    List<Requisition> getRequisitionsByDateRange(LocalDate startDate, LocalDate endDate);
    
    Requisition submitRequisition(Long requisitionId);
    
    Requisition verifyRequisition(Long requisitionId, Long verifiedByUserId);
    
    Requisition approveRequisition(Long requisitionId, Long approvedByUserId);
    
    Requisition rejectRequisition(Long requisitionId, Long rejectedByUserId, String reason);
    
    Requisition issueGoods(Long requisitionId, Long issuedByUserId, Long receivedByUserId);
    
    boolean checkStockAvailability(Long requisitionId);
    
    void adjustIssuedQuantities(Long requisitionId);
    
    void deleteRequisition(Long id);
    
    String generateRequisitionNumber();
}
