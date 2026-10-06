package com.hospital.controller;

import com.hospital.dto.CreatePurchasePlanRequest;
import com.hospital.dto.PurchasePlanResponse;
import com.hospital.entity.PurchasePlan;
import com.hospital.entity.PurchasePlanItem;
import com.hospital.enums.PlanStatus;
import com.hospital.response.ApiResponse;
import com.hospital.security.SecurityUtils;
import com.hospital.service.MaterialService;
import com.hospital.service.PurchasePlanService;
import com.hospital.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/purchase-plans")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Purchase Plan Management", description = "APIs quản lý kế hoạch đặt hàng")
public class PurchasePlanController {

    private final PurchasePlanService purchasePlanService;
    private final UserService userService;
    private final MaterialService materialService;

    @PostMapping
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Lập kế hoạch đặt hàng mới (DRAFT)")
    public ResponseEntity<ApiResponse<PurchasePlanResponse>> createPurchasePlan(
            @Valid @RequestBody CreatePurchasePlanRequest request) {

        log.info("Creating new purchase plan with {} items", request.getItems().size());

        PurchasePlan plan = new PurchasePlan();
        plan.setPlanDate(request.getPlanDate());
        plan.setNotes(request.getNotes());
        plan.setCreatedBy(userService.getUserById(SecurityUtils.getCurrentUserId()));

        List<PurchasePlanItem> items = convertToItems(request);

        PurchasePlan created = purchasePlanService.createPurchasePlan(plan, items);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Lập kế hoạch đặt hàng thành công", convertToResponse(created)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Cập nhật kế hoạch đặt hàng (chỉ khi DRAFT)")
    public ResponseEntity<ApiResponse<PurchasePlanResponse>> updatePurchasePlan(
            @PathVariable Long id,
            @Valid @RequestBody CreatePurchasePlanRequest request) {

        log.info("Updating purchase plan: {}", id);

        PurchasePlan plan = new PurchasePlan();
        plan.setPlanDate(request.getPlanDate());
        plan.setNotes(request.getNotes());

        List<PurchasePlanItem> items = convertToItems(request);

        PurchasePlan updated = purchasePlanService.updatePurchasePlan(id, plan, items);

        return ResponseEntity.ok(ApiResponse.success(
            "Cập nhật kế hoạch đặt hàng thành công", convertToResponse(updated)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Lấy thông tin kế hoạch đặt hàng theo ID")
    public ResponseEntity<ApiResponse<PurchasePlanResponse>> getPurchasePlan(
            @PathVariable Long id) {

        log.info("Getting purchase plan: {}", id);

        PurchasePlan plan = purchasePlanService.getPurchasePlanById(id);

        return ResponseEntity.ok(ApiResponse.success(convertToResponse(plan)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Lấy danh sách tất cả kế hoạch đặt hàng")
    public ResponseEntity<ApiResponse<List<PurchasePlanResponse>>> getAllPurchasePlans(
            @RequestParam(required = false) PlanStatus status) {

        log.info("Getting all purchase plans with status: {}", status);

        List<PurchasePlan> plans = status != null
            ? purchasePlanService.getPurchasePlansByStatus(status)
            : purchasePlanService.getAllPurchasePlans();

        List<PurchasePlanResponse> responses = plans.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/recommended-quantity")
    @PreAuthorize("hasAnyRole('WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Gợi ý số lượng đặt dựa trên mức tiêu thụ 30 ngày và tồn kho")
    public ResponseEntity<ApiResponse<Integer>> getRecommendedQuantity(
            @RequestParam Long materialId) {

        log.info("Calculating recommended quantity for material: {}", materialId);

        Integer recommended = purchasePlanService.calculateRecommendedQuantity(materialId);

        return ResponseEntity.ok(ApiResponse.success(recommended));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Gửi kế hoạch để duyệt (DRAFT → PENDING)")
    public ResponseEntity<ApiResponse<PurchasePlanResponse>> submitForApproval(
            @PathVariable Long id) {

        log.info("Submitting purchase plan for approval: {}", id);

        PurchasePlan plan = purchasePlanService.submitForApproval(id);

        return ResponseEntity.ok(ApiResponse.success(
            "Gửi kế hoạch đặt hàng thành công", convertToResponse(plan)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('WAREHOUSE_MANAGER')")
    @Operation(summary = "Trưởng VTTBYT duyệt kế hoạch (PENDING → APPROVED)")
    public ResponseEntity<ApiResponse<PurchasePlanResponse>> approvePlan(
            @PathVariable Long id) {

        Long approvedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Approving purchase plan: {} by user: {}", id, approvedByUserId);

        PurchasePlan plan = purchasePlanService.approvePlan(id, approvedByUserId);

        return ResponseEntity.ok(ApiResponse.success(
            "Duyệt kế hoạch đặt hàng thành công", convertToResponse(plan)));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('WAREHOUSE_MANAGER')")
    @Operation(summary = "Trưởng VTTBYT từ chối kế hoạch (PENDING → REJECTED)")
    public ResponseEntity<ApiResponse<PurchasePlanResponse>> rejectPlan(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {

        Long rejectedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Rejecting purchase plan: {} by user: {}", id, rejectedByUserId);

        PurchasePlan plan = purchasePlanService.rejectPlan(id, rejectedByUserId, reason);

        return ResponseEntity.ok(ApiResponse.success(
            "Từ chối kế hoạch đặt hàng", convertToResponse(plan)));
    }

    @PostMapping("/{id}/place-order")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Đặt hàng theo kế hoạch đã duyệt (APPROVED → COMPLETED)")
    public ResponseEntity<ApiResponse<PurchasePlanResponse>> placeOrder(
            @PathVariable Long id) {

        log.info("Placing order for purchase plan: {}", id);

        PurchasePlan plan = purchasePlanService.completePlan(id);

        return ResponseEntity.ok(ApiResponse.success(
            "Đặt hàng thành công", convertToResponse(plan)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Xóa kế hoạch đặt hàng (chỉ khi DRAFT hoặc REJECTED)")
    public ResponseEntity<ApiResponse<Void>> deletePurchasePlan(@PathVariable Long id) {

        log.info("Deleting purchase plan: {}", id);

        purchasePlanService.deletePurchasePlan(id);

        return ResponseEntity.ok(ApiResponse.success("Xóa kế hoạch đặt hàng thành công", null));
    }

    private List<PurchasePlanItem> convertToItems(CreatePurchasePlanRequest request) {
        return request.getItems().stream()
            .map(itemDto -> {
                PurchasePlanItem item = new PurchasePlanItem();
                item.setMaterial(materialService.getMaterialById(itemDto.getMaterialId()));
                item.setRequestedQuantity(itemDto.getRequestedQuantity());
                item.setEstimatedPrice(itemDto.getEstimatedPrice());
                return item;
            })
            .collect(Collectors.toList());
    }

    private PurchasePlanResponse convertToResponse(PurchasePlan plan) {
        PurchasePlanResponse response = new PurchasePlanResponse();
        response.setId(plan.getId());
        response.setPlanDate(plan.getPlanDate());
        response.setStatus(plan.getStatus());
        response.setNotes(plan.getNotes());

        response.setCreatedById(plan.getCreatedBy().getId());
        response.setCreatedByName(plan.getCreatedBy().getFullName());

        if (plan.getApprovedBy() != null) {
            response.setApprovedById(plan.getApprovedBy().getId());
            response.setApprovedByName(plan.getApprovedBy().getFullName());
        }

        List<PurchasePlanResponse.PurchasePlanItemResponse> itemResponses =
            plan.getItems().stream()
                .map(item -> {
                    PurchasePlanResponse.PurchasePlanItemResponse itemResponse =
                        new PurchasePlanResponse.PurchasePlanItemResponse();
                    itemResponse.setId(item.getId());
                    itemResponse.setMaterialId(item.getMaterial().getId());
                    itemResponse.setMaterialCode(item.getMaterial().getCode());
                    itemResponse.setMaterialName(item.getMaterial().getName());
                    itemResponse.setMaterialUnit(item.getMaterial().getUnit());
                    itemResponse.setRequestedQuantity(item.getRequestedQuantity());
                    itemResponse.setEstimatedPrice(item.getEstimatedPrice());

                    if (item.getEstimatedPrice() != null) {
                        itemResponse.setEstimatedAmount(item.getEstimatedPrice()
                            .multiply(BigDecimal.valueOf(item.getRequestedQuantity())));
                    }

                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);
        response.setTotalEstimatedAmount(itemResponses.stream()
            .map(PurchasePlanResponse.PurchasePlanItemResponse::getEstimatedAmount)
            .filter(amount -> amount != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add));

        return response;
    }
}
