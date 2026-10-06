package com.hospital.service.impl;

import com.hospital.entity.Material;
import com.hospital.entity.PurchasePlan;
import com.hospital.entity.PurchasePlanItem;
import com.hospital.entity.User;
import com.hospital.enums.PlanStatus;
import com.hospital.enums.RequisitionStatus;
import com.hospital.exception.BusinessException;
import com.hospital.exception.InvalidStatusTransitionException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MaterialRepository;
import com.hospital.repository.PurchasePlanItemRepository;
import com.hospital.repository.PurchasePlanRepository;
import com.hospital.repository.RequisitionItemRepository;
import com.hospital.repository.UserRepository;
import com.hospital.service.PurchasePlanService;
import com.hospital.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PurchasePlanServiceImpl implements PurchasePlanService {

    private static final int USAGE_PERIOD_DAYS = 30;

    private final PurchasePlanRepository purchasePlanRepository;
    private final PurchasePlanItemRepository purchasePlanItemRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final RequisitionItemRepository requisitionItemRepository;
    private final StockService stockService;

    @Override
    public PurchasePlan createPurchasePlan(PurchasePlan plan, List<PurchasePlanItem> items) {
        log.info("Creating new purchase plan");

        User creator = userRepository.findById(plan.getCreatedBy().getId())
            .orElseThrow(() -> new ResourceNotFoundException("User", "id",
                plan.getCreatedBy().getId()));

        plan.setStatus(PlanStatus.DRAFT);
        plan.setCreatedBy(creator);

        PurchasePlan savedPlan = purchasePlanRepository.save(plan);

        for (PurchasePlanItem item : items) {
            Material material = materialRepository.findById(item.getMaterial().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id",
                    item.getMaterial().getId()));

            item.setPurchasePlan(savedPlan);
            item.setMaterial(material);
            purchasePlanItemRepository.save(item);
            savedPlan.getItems().add(item);
        }

        log.info("Created purchase plan with id: {}", savedPlan.getId());
        return savedPlan;
    }

    @Override
    public PurchasePlan updatePurchasePlan(Long id, PurchasePlan plan, List<PurchasePlanItem> items) {
        log.info("Updating purchase plan with id: {}", id);

        PurchasePlan existingPlan = getPurchasePlanById(id);

        if (existingPlan.getStatus() != PlanStatus.DRAFT) {
            throw new InvalidStatusTransitionException(
                "Chỉ có thể cập nhật kế hoạch ở trạng thái DRAFT");
        }

        existingPlan.setPlanDate(plan.getPlanDate());
        existingPlan.setNotes(plan.getNotes());

        purchasePlanItemRepository.deleteAll(existingPlan.getItems());
        existingPlan.getItems().clear();

        for (PurchasePlanItem item : items) {
            Material material = materialRepository.findById(item.getMaterial().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id",
                    item.getMaterial().getId()));

            item.setPurchasePlan(existingPlan);
            item.setMaterial(material);
            purchasePlanItemRepository.save(item);
            existingPlan.getItems().add(item);
        }

        return purchasePlanRepository.save(existingPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchasePlan getPurchasePlanById(Long id) {
        return purchasePlanRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("PurchasePlan", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchasePlan> getAllPurchasePlans() {
        return purchasePlanRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchasePlan> getPurchasePlansByStatus(PlanStatus status) {
        return purchasePlanRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchasePlan> getPurchasePlansByCreatedBy(Long userId) {
        return purchasePlanRepository.findByCreatedById(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchasePlan> getPurchasePlansByDateRange(LocalDate startDate, LocalDate endDate) {
        return purchasePlanRepository.findByPlanDateBetween(startDate, endDate);
    }

    @Override
    public PurchasePlan submitForApproval(Long planId) {
        log.info("Submitting purchase plan for approval: {}", planId);

        PurchasePlan plan = getPurchasePlanById(planId);

        if (plan.getStatus() != PlanStatus.DRAFT) {
            throw new InvalidStatusTransitionException(
                plan.getStatus().toString(), PlanStatus.PENDING.toString());
        }

        plan.setStatus(PlanStatus.PENDING);

        return purchasePlanRepository.save(plan);
    }

    @Override
    public PurchasePlan approvePlan(Long planId, Long approvedByUserId) {
        log.info("Approving purchase plan: {} by user: {}", planId, approvedByUserId);

        PurchasePlan plan = getPurchasePlanById(planId);
        User approver = userRepository.findById(approvedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", approvedByUserId));

        if (plan.getStatus() != PlanStatus.PENDING) {
            throw new InvalidStatusTransitionException(
                plan.getStatus().toString(), PlanStatus.APPROVED.toString());
        }

        plan.setStatus(PlanStatus.APPROVED);
        plan.setApprovedBy(approver);

        return purchasePlanRepository.save(plan);
    }

    @Override
    public PurchasePlan rejectPlan(Long planId, Long approvedByUserId, String reason) {
        log.info("Rejecting purchase plan: {} by user: {}, reason: {}",
            planId, approvedByUserId, reason);

        PurchasePlan plan = getPurchasePlanById(planId);
        User rejector = userRepository.findById(approvedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", approvedByUserId));

        if (plan.getStatus() != PlanStatus.PENDING) {
            throw new InvalidStatusTransitionException(
                plan.getStatus().toString(), PlanStatus.REJECTED.toString());
        }

        String rejectNote = "Từ chối bởi " + rejector.getFullName()
            + (reason != null && !reason.isBlank() ? ": " + reason : "");
        String oldNotes = plan.getNotes();
        plan.setNotes(oldNotes == null || oldNotes.isBlank()
            ? rejectNote
            : oldNotes + "\n" + rejectNote);
        plan.setStatus(PlanStatus.REJECTED);

        return purchasePlanRepository.save(plan);
    }

    @Override
    public PurchasePlan completePlan(Long planId) {
        log.info("Completing purchase plan: {}", planId);

        PurchasePlan plan = getPurchasePlanById(planId);

        if (plan.getStatus() != PlanStatus.APPROVED) {
            throw new InvalidStatusTransitionException(
                plan.getStatus().toString(), PlanStatus.COMPLETED.toString());
        }

        plan.setStatus(PlanStatus.COMPLETED);

        return purchasePlanRepository.save(plan);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer calculateRecommendedQuantity(Long materialId) {
        materialRepository.findById(materialId)
            .orElseThrow(() -> new ResourceNotFoundException("Material", "id", materialId));

        Long monthlyUsage = requisitionItemRepository.sumIssuedQuantitySince(
            materialId, RequisitionStatus.ISSUED, LocalDate.now().minusDays(USAGE_PERIOD_DAYS));

        Integer available = stockService.getAvailableQuantityByMaterialId(materialId);

        long recommended = (monthlyUsage != null ? monthlyUsage : 0L) - available;

        return (int) Math.max(0L, recommended);
    }

    @Override
    public void deletePurchasePlan(Long id) {
        log.info("Deleting purchase plan with id: {}", id);

        PurchasePlan plan = getPurchasePlanById(id);

        if (plan.getStatus() != PlanStatus.DRAFT && plan.getStatus() != PlanStatus.REJECTED) {
            throw new BusinessException(
                "Chỉ có thể xóa kế hoạch ở trạng thái DRAFT hoặc REJECTED");
        }

        purchasePlanRepository.delete(plan);
    }
}
