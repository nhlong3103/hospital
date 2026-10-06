package com.hospital.service.impl;

import com.hospital.entity.*;
import com.hospital.enums.RequisitionStatus;
import com.hospital.exception.BusinessException;
import com.hospital.exception.InvalidStatusTransitionException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import com.hospital.service.IssueNoteService;
import com.hospital.service.RequisitionService;
import com.hospital.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RequisitionServiceImpl implements RequisitionService {
    
    private final RequisitionRepository requisitionRepository;
    private final RequisitionItemRepository requisitionItemRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final StockService stockService;
    private final IssueNoteService issueNoteService;
    
    @Override
    public Requisition createRequisition(Requisition requisition, List<RequisitionItem> items) {
        log.info("Creating new requisition for department: {}", requisition.getDepartment().getId());
        
        Department department = departmentRepository.findById(requisition.getDepartment().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Department", "id", 
                requisition.getDepartment().getId()));
        
        User creator = userRepository.findById(requisition.getCreatedBy().getId())
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", 
                requisition.getCreatedBy().getId()));
        
        requisition.setStatus(RequisitionStatus.DRAFT);
        requisition.setDepartment(department);
        requisition.setCreatedBy(creator);
        
        if (requisition.getRequisitionNumber() == null || requisition.getRequisitionNumber().isEmpty()) {
            requisition.setRequisitionNumber(generateRequisitionNumber());
        }
        
        Requisition savedRequisition = requisitionRepository.save(requisition);
        
        for (RequisitionItem item : items) {
            Material material = materialRepository.findById(item.getMaterial().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", 
                    item.getMaterial().getId()));
            
            item.setRequisition(savedRequisition);
            item.setMaterial(material);
            item.setIssuedQuantity(null);
            requisitionItemRepository.save(item);
            savedRequisition.getItems().add(item);
        }
        
        log.info("Created requisition with number: {}", savedRequisition.getRequisitionNumber());
        return savedRequisition;
    }
    
    @Override
    public Requisition updateRequisition(Long id, Requisition requisition, List<RequisitionItem> items) {
        log.info("Updating requisition with id: {}", id);
        
        Requisition existingRequisition = getRequisitionById(id);
        
        if (existingRequisition.getStatus() != RequisitionStatus.DRAFT) {
            throw new InvalidStatusTransitionException(
                "Chỉ có thể cập nhật phiếu lĩnh ở trạng thái DRAFT");
        }
        
        existingRequisition.setRequisitionDate(requisition.getRequisitionDate());
        
        requisitionItemRepository.deleteAll(existingRequisition.getItems());
        existingRequisition.getItems().clear();
        
        for (RequisitionItem item : items) {
            Material material = materialRepository.findById(item.getMaterial().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", 
                    item.getMaterial().getId()));
            
            item.setRequisition(existingRequisition);
            item.setMaterial(material);
            requisitionItemRepository.save(item);
        }
        
        return requisitionRepository.save(existingRequisition);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Requisition getRequisitionById(Long id) {
        return requisitionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Requisition", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Requisition getRequisitionByNumber(String requisitionNumber) {
        return requisitionRepository.findByRequisitionNumber(requisitionNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Requisition", "requisitionNumber", 
                requisitionNumber));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Requisition> getAllRequisitions() {
        return requisitionRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Requisition> getRequisitionsByStatus(RequisitionStatus status) {
        return requisitionRepository.findByStatus(status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Requisition> getRequisitionsByDepartment(Long departmentId) {
        return requisitionRepository.findByDepartmentId(departmentId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Requisition> getRequisitionsByCreatedBy(Long userId) {
        return requisitionRepository.findByCreatedById(userId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Requisition> getRequisitionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return requisitionRepository.findByRequisitionDateBetween(startDate, endDate);
    }
    
    @Override
    public Requisition submitRequisition(Long requisitionId) {
        log.info("Submitting requisition: {}", requisitionId);
        
        Requisition requisition = getRequisitionById(requisitionId);
        
        if (requisition.getStatus() != RequisitionStatus.DRAFT) {
            throw new InvalidStatusTransitionException(
                requisition.getStatus().toString(), RequisitionStatus.PENDING.toString());
        }
        
        requisition.setStatus(RequisitionStatus.PENDING);
        return requisitionRepository.save(requisition);
    }
    
    @Override
    public Requisition verifyRequisition(Long requisitionId, Long verifiedByUserId) {
        log.info("Verifying requisition: {} by user: {}", requisitionId, verifiedByUserId);
        
        Requisition requisition = getRequisitionById(requisitionId);
        User verifier = userRepository.findById(verifiedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", verifiedByUserId));
        
        if (requisition.getStatus() != RequisitionStatus.PENDING) {
            throw new InvalidStatusTransitionException(
                requisition.getStatus().toString(), RequisitionStatus.VERIFIED.toString());
        }
        
        adjustIssuedQuantities(requisitionId);
        
        requisition.setStatus(RequisitionStatus.VERIFIED);
        requisition.setVerifiedBy(verifier);
        
        return requisitionRepository.save(requisition);
    }
    
    @Override
    public Requisition approveRequisition(Long requisitionId, Long approvedByUserId) {
        log.info("Approving requisition: {} by user: {}", requisitionId, approvedByUserId);
        
        Requisition requisition = getRequisitionById(requisitionId);
        User approver = userRepository.findById(approvedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", approvedByUserId));
        
        if (requisition.getStatus() != RequisitionStatus.VERIFIED) {
            throw new InvalidStatusTransitionException(
                requisition.getStatus().toString(), RequisitionStatus.APPROVED.toString());
        }
        
        requisition.setStatus(RequisitionStatus.APPROVED);
        
        return requisitionRepository.save(requisition);
    }
    
    @Override
    public Requisition rejectRequisition(Long requisitionId, Long rejectedByUserId, String reason) {
        log.info("Rejecting requisition: {} by user: {}, reason: {}", 
            requisitionId, rejectedByUserId, reason);
        
        Requisition requisition = getRequisitionById(requisitionId);
        
        if (requisition.getStatus() != RequisitionStatus.PENDING 
            && requisition.getStatus() != RequisitionStatus.VERIFIED) {
            throw new InvalidStatusTransitionException(
                "Chỉ có thể từ chối phiếu lĩnh ở trạng thái PENDING hoặc VERIFIED");
        }
        
        requisition.setStatus(RequisitionStatus.REJECTED);
        
        return requisitionRepository.save(requisition);
    }
    
    @Override
    public Requisition issueGoods(Long requisitionId, Long issuedByUserId, Long receivedByUserId) {
        log.info("Issuing goods for requisition: {}", requisitionId);
        
        Requisition requisition = getRequisitionById(requisitionId);
        
        if (requisition.getStatus() != RequisitionStatus.APPROVED) {
            throw new InvalidStatusTransitionException(
                requisition.getStatus().toString(), RequisitionStatus.ISSUED.toString());
        }
        
        if (!checkStockAvailability(requisitionId)) {
            throw new BusinessException(
                "Không đủ tồn kho để xuất. Vui lòng kiểm tra lại.");
        }
        
        for (RequisitionItem item : requisition.getItems()) {
            Integer quantityToIssue = item.getIssuedQuantity() != null 
                ? item.getIssuedQuantity() 
                : item.getRequestedQuantity();
            
            stockService.reduceStock(item.getMaterial().getId(), quantityToIssue);
        }
        
        issueNoteService.createIssueNote(requisitionId, issuedByUserId, receivedByUserId);
        
        requisition.setStatus(RequisitionStatus.ISSUED);
        
        log.info("Successfully issued goods for requisition: {}", requisitionId);
        return requisitionRepository.save(requisition);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean checkStockAvailability(Long requisitionId) {
        Requisition requisition = getRequisitionById(requisitionId);
        
        for (RequisitionItem item : requisition.getItems()) {
            Integer requiredQuantity = item.getIssuedQuantity() != null
                ? item.getIssuedQuantity()
                : item.getRequestedQuantity();

            if (!stockService.isStockAvailable(item.getMaterial().getId(), requiredQuantity)) {
                return false;
            }
        }
        
        return true;
    }
    
    @Override
    public void adjustIssuedQuantities(Long requisitionId) {
        log.info("Adjusting issued quantities for requisition: {}", requisitionId);
        
        Requisition requisition = getRequisitionById(requisitionId);
        
        for (RequisitionItem item : requisition.getItems()) {
            Integer requestedQty = item.getRequestedQuantity();
            Integer availableQty = stockService.getAvailableQuantityByMaterialId(
                item.getMaterial().getId());
            
            if (availableQty < requestedQty) {
                log.warn("Insufficient stock for material {}. Requested: {}, Available: {}", 
                    item.getMaterial().getName(), requestedQty, availableQty);
                item.setIssuedQuantity(availableQty);
            } else {
                item.setIssuedQuantity(requestedQty);
            }
            
            requisitionItemRepository.save(item);
        }
    }
    
    @Override
    public void deleteRequisition(Long id) {
        log.info("Deleting requisition with id: {}", id);
        
        Requisition requisition = getRequisitionById(id);
        
        if (requisition.getStatus() != RequisitionStatus.DRAFT 
            && requisition.getStatus() != RequisitionStatus.REJECTED) {
            throw new BusinessException(
                "Chỉ có thể xóa phiếu lĩnh ở trạng thái DRAFT hoặc REJECTED");
        }
        
        requisitionRepository.delete(requisition);
    }
    
    @Override
    public String generateRequisitionNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        LocalDate today = LocalDate.now();
        List<Requisition> todayRequisitions = requisitionRepository
            .findByRequisitionDateBetween(today, today);
        
        int sequence = todayRequisitions.size() + 1;
        
        return String.format("PL-%s-%03d", dateStr, sequence);
    }
}
