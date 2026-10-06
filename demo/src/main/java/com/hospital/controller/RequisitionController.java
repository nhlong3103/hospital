package com.hospital.controller;

import com.hospital.dto.CreateRequisitionRequest;
import com.hospital.dto.RequisitionResponse;
import com.hospital.entity.*;
import com.hospital.enums.RequisitionStatus;
import com.hospital.enums.UserRole;
import com.hospital.response.ApiResponse;
import com.hospital.security.CustomUserDetails;
import com.hospital.security.SecurityUtils;
import com.hospital.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/requisitions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Requisition Management", description = "APIs quản lý phiếu lĩnh vật tư")
public class RequisitionController {

    private final RequisitionService requisitionService;
    private final DepartmentService departmentService;
    private final UserService userService;
    private final MaterialService materialService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DEPARTMENT_STAFF', 'DEPARTMENT_HEAD')")
    @Operation(summary = "Tạo phiếu lĩnh mới (DRAFT)")
    public ResponseEntity<ApiResponse<RequisitionResponse>> createRequisition(
            @Valid @RequestBody CreateRequisitionRequest request) {

        log.info("Creating new requisition for department: {}", request.getDepartmentId());

        CustomUserDetails currentUser = SecurityUtils.getCurrentUser();
        if (!request.getDepartmentId().equals(currentUser.getDepartmentId())) {
            throw new AccessDeniedException("Chỉ được lập phiếu lĩnh cho khoa/phòng của mình");
        }

        Requisition requisition = new Requisition();
        requisition.setDepartment(departmentService.getDepartmentById(request.getDepartmentId()));
        requisition.setCreatedBy(userService.getUserById(currentUser.getId()));
        requisition.setRequisitionDate(request.getRequisitionDate());

        List<RequisitionItem> items = request.getItems().stream()
            .map(itemDto -> {
                RequisitionItem item = new RequisitionItem();
                item.setMaterial(materialService.getMaterialById(itemDto.getMaterialId()));
                item.setRequestedQuantity(itemDto.getRequestedQuantity());
                return item;
            })
            .collect(Collectors.toList());

        Requisition created = requisitionService.createRequisition(requisition, items);
        RequisitionResponse response = convertToResponse(created);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo phiếu lĩnh thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin phiếu lĩnh theo ID")
    public ResponseEntity<ApiResponse<RequisitionResponse>> getRequisition(
            @PathVariable Long id) {

        log.info("Getting requisition: {}", id);

        Requisition requisition = requisitionService.getRequisitionById(id);
        checkDepartmentAccess(requisition);
        RequisitionResponse response = convertToResponse(requisition);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả phiếu lĩnh")
    public ResponseEntity<ApiResponse<List<RequisitionResponse>>> getAllRequisitions(
            @RequestParam(required = false) RequisitionStatus status,
            @RequestParam(required = false) Long departmentId) {

        log.info("Getting all requisitions with status: {}, departmentId: {}",
            status, departmentId);

        List<Requisition> requisitions;

        if (status != null) {
            requisitions = requisitionService.getRequisitionsByStatus(status);
        } else if (departmentId != null) {
            requisitions = requisitionService.getRequisitionsByDepartment(departmentId);
        } else {
            requisitions = requisitionService.getAllRequisitions();
        }

        List<RequisitionResponse> responses = requisitions.stream()
            .filter(this::canAccessDepartment)
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Lấy phiếu lĩnh theo khoảng thời gian")
    public ResponseEntity<ApiResponse<List<RequisitionResponse>>> getRequisitionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Getting requisitions from {} to {}", startDate, endDate);

        List<RequisitionResponse> responses = requisitionService
            .getRequisitionsByDateRange(startDate, endDate).stream()
            .filter(this::canAccessDepartment)
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('DEPARTMENT_STAFF', 'DEPARTMENT_HEAD')")
    @Operation(summary = "Gửi phiếu lĩnh (DRAFT → PENDING)")
    public ResponseEntity<ApiResponse<RequisitionResponse>> submitRequisition(
            @PathVariable Long id) {

        log.info("Submitting requisition: {}", id);

        checkDepartmentAccess(requisitionService.getRequisitionById(id));

        Requisition requisition = requisitionService.submitRequisition(id);
        RequisitionResponse response = convertToResponse(requisition);

        return ResponseEntity.ok(ApiResponse.success("Gửi phiếu lĩnh thành công", response));
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Thủ kho xác nhận phiếu lĩnh (PENDING → VERIFIED)")
    public ResponseEntity<ApiResponse<RequisitionResponse>> verifyRequisition(
            @PathVariable Long id) {

        Long verifiedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Verifying requisition: {} by user: {}", id, verifiedByUserId);

        Requisition requisition = requisitionService.verifyRequisition(id, verifiedByUserId);
        RequisitionResponse response = convertToResponse(requisition);

        return ResponseEntity.ok(ApiResponse.success(
            "Xác nhận phiếu lĩnh thành công. Số lượng thực cấp đã được điều chỉnh.", response));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('DEPARTMENT_HEAD')")
    @Operation(summary = "Trưởng khoa duyệt phiếu lĩnh (VERIFIED → APPROVED)")
    public ResponseEntity<ApiResponse<RequisitionResponse>> approveRequisition(
            @PathVariable Long id) {

        Long approvedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Approving requisition: {} by user: {}", id, approvedByUserId);

        checkDepartmentAccess(requisitionService.getRequisitionById(id));

        Requisition requisition = requisitionService.approveRequisition(id, approvedByUserId);
        RequisitionResponse response = convertToResponse(requisition);

        return ResponseEntity.ok(ApiResponse.success("Duyệt phiếu lĩnh thành công", response));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('WAREHOUSE_KEEPER', 'DEPARTMENT_HEAD')")
    @Operation(summary = "Từ chối phiếu lĩnh (PENDING/VERIFIED → REJECTED)")
    public ResponseEntity<ApiResponse<RequisitionResponse>> rejectRequisition(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {

        Long rejectedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Rejecting requisition: {} by user: {}, reason: {}",
            id, rejectedByUserId, reason);

        checkDepartmentAccess(requisitionService.getRequisitionById(id));

        Requisition requisition = requisitionService.rejectRequisition(
            id, rejectedByUserId, reason);
        RequisitionResponse response = convertToResponse(requisition);

        return ResponseEntity.ok(ApiResponse.success("Từ chối phiếu lĩnh", response));
    }

    @PostMapping("/{id}/issue")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Xuất kho và cập nhật tồn kho (APPROVED → ISSUED)")
    public ResponseEntity<ApiResponse<RequisitionResponse>> issueGoods(
            @PathVariable Long id) {

        Long issuedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Issuing goods for requisition: {} by user: {}", id, issuedByUserId);

        Long receivedByUserId = requisitionService.getRequisitionById(id).getCreatedBy().getId();

        Requisition requisition = requisitionService.issueGoods(
            id, issuedByUserId, receivedByUserId);
        RequisitionResponse response = convertToResponse(requisition);

        return ResponseEntity.ok(ApiResponse.success(
            "Xuất kho thành công. Tồn kho đã được cập nhật và chứng từ xuất đã được tạo.",
            response));
    }

    @GetMapping("/{id}/check-availability")
    @Operation(summary = "Kiểm tra xem có đủ tồn kho để xuất không")
    public ResponseEntity<ApiResponse<Boolean>> checkStockAvailability(@PathVariable Long id) {

        log.info("Checking stock availability for requisition: {}", id);

        checkDepartmentAccess(requisitionService.getRequisitionById(id));

        boolean available = requisitionService.checkStockAvailability(id);

        return ResponseEntity.ok(ApiResponse.success(available));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEPARTMENT_STAFF', 'DEPARTMENT_HEAD')")
    @Operation(summary = "Xóa phiếu lĩnh (chỉ khi DRAFT hoặc REJECTED)")
    public ResponseEntity<ApiResponse<Void>> deleteRequisition(@PathVariable Long id) {

        log.info("Deleting requisition: {}", id);

        checkDepartmentAccess(requisitionService.getRequisitionById(id));

        requisitionService.deleteRequisition(id);

        return ResponseEntity.ok(ApiResponse.success("Xóa phiếu lĩnh thành công", null));
    }

    private boolean canAccessDepartment(Requisition requisition) {
        CustomUserDetails currentUser = SecurityUtils.getCurrentUser();

        if (currentUser.getRole() == UserRole.DEPARTMENT_STAFF
            || currentUser.getRole() == UserRole.DEPARTMENT_HEAD) {
            return requisition.getDepartment().getId().equals(currentUser.getDepartmentId());
        }

        return true;
    }

    private void checkDepartmentAccess(Requisition requisition) {
        if (!canAccessDepartment(requisition)) {
            throw new AccessDeniedException("Bạn chỉ được thao tác với phiếu lĩnh của khoa/phòng mình");
        }
    }

    private RequisitionResponse convertToResponse(Requisition requisition) {
        RequisitionResponse response = new RequisitionResponse();
        response.setId(requisition.getId());
        response.setRequisitionNumber(requisition.getRequisitionNumber());
        response.setRequisitionDate(requisition.getRequisitionDate());
        response.setStatus(requisition.getStatus());

        response.setDepartmentId(requisition.getDepartment().getId());
        response.setDepartmentName(requisition.getDepartment().getName());

        response.setCreatedById(requisition.getCreatedBy().getId());
        response.setCreatedByName(requisition.getCreatedBy().getFullName());

        if (requisition.getVerifiedBy() != null) {
            response.setVerifiedById(requisition.getVerifiedBy().getId());
            response.setVerifiedByName(requisition.getVerifiedBy().getFullName());
        }

        List<RequisitionResponse.RequisitionItemResponse> itemResponses =
            requisition.getItems().stream()
                .map(item -> {
                    RequisitionResponse.RequisitionItemResponse itemResponse =
                        new RequisitionResponse.RequisitionItemResponse();
                    itemResponse.setId(item.getId());
                    itemResponse.setMaterialId(item.getMaterial().getId());
                    itemResponse.setMaterialCode(item.getMaterial().getCode());
                    itemResponse.setMaterialName(item.getMaterial().getName());
                    itemResponse.setMaterialUnit(item.getMaterial().getUnit());
                    itemResponse.setRequestedQuantity(item.getRequestedQuantity());
                    itemResponse.setIssuedQuantity(item.getIssuedQuantity());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);

        return response;
    }
}
