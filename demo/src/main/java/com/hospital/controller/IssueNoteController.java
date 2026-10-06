package com.hospital.controller;

import com.hospital.dto.IssueNoteResponse;
import com.hospital.entity.IssueNote;
import com.hospital.enums.UserRole;
import com.hospital.response.ApiResponse;
import com.hospital.security.CustomUserDetails;
import com.hospital.security.SecurityUtils;
import com.hospital.service.IssueNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/issue-notes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Issue Note Management", description = "APIs quản lý chứng từ xuất kho")
public class IssueNoteController {

    private final IssueNoteService issueNoteService;

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chứng từ xuất kho theo ID")
    public ResponseEntity<ApiResponse<IssueNoteResponse>> getIssueNote(@PathVariable Long id) {

        log.info("Getting issue note: {}", id);

        IssueNote issueNote = issueNoteService.getIssueNoteById(id);
        checkDepartmentAccess(issueNote);

        return ResponseEntity.ok(ApiResponse.success(convertToResponse(issueNote)));
    }

    @GetMapping("/number/{issueNumber}")
    @Operation(summary = "Lấy chứng từ xuất kho theo số chứng từ")
    public ResponseEntity<ApiResponse<IssueNoteResponse>> getIssueNoteByNumber(
            @PathVariable String issueNumber) {

        log.info("Getting issue note by number: {}", issueNumber);

        IssueNote issueNote = issueNoteService.getIssueNoteByNumber(issueNumber);
        checkDepartmentAccess(issueNote);

        return ResponseEntity.ok(ApiResponse.success(convertToResponse(issueNote)));
    }

    @GetMapping("/requisition/{requisitionId}")
    @Operation(summary = "Lấy chứng từ xuất kho theo phiếu lĩnh")
    public ResponseEntity<ApiResponse<IssueNoteResponse>> getIssueNoteByRequisition(
            @PathVariable Long requisitionId) {

        log.info("Getting issue note by requisition: {}", requisitionId);

        IssueNote issueNote = issueNoteService.getIssueNoteByRequisition(requisitionId);
        checkDepartmentAccess(issueNote);

        return ResponseEntity.ok(ApiResponse.success(convertToResponse(issueNote)));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả chứng từ xuất kho")
    public ResponseEntity<ApiResponse<List<IssueNoteResponse>>> getAllIssueNotes() {

        log.info("Getting all issue notes");

        List<IssueNoteResponse> issueNotes = issueNoteService.getAllIssueNotes().stream()
            .filter(this::canAccessDepartment)
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(issueNotes));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Lấy chứng từ xuất kho theo khoảng thời gian")
    public ResponseEntity<ApiResponse<List<IssueNoteResponse>>> getIssueNotesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Getting issue notes from {} to {}", startDate, endDate);

        List<IssueNoteResponse> issueNotes = issueNoteService
            .getIssueNotesByDateRange(startDate, endDate).stream()
            .filter(this::canAccessDepartment)
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(issueNotes));
    }

    @GetMapping("/issued-by/{userId}")
    @Operation(summary = "Lấy chứng từ xuất kho theo người xuất (Thủ kho)")
    public ResponseEntity<ApiResponse<List<IssueNoteResponse>>> getIssueNotesByIssuedBy(
            @PathVariable Long userId) {

        log.info("Getting issue notes by issued by user: {}", userId);

        List<IssueNoteResponse> issueNotes = issueNoteService.getIssueNotesByIssuedBy(userId).stream()
            .filter(this::canAccessDepartment)
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(issueNotes));
    }

    @GetMapping("/received-by/{userId}")
    @Operation(summary = "Lấy chứng từ xuất kho theo người nhận (ĐD/KTV)")
    public ResponseEntity<ApiResponse<List<IssueNoteResponse>>> getIssueNotesByReceivedBy(
            @PathVariable Long userId) {

        log.info("Getting issue notes by received by user: {}", userId);

        List<IssueNoteResponse> issueNotes = issueNoteService.getIssueNotesByReceivedBy(userId).stream()
            .filter(this::canAccessDepartment)
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(issueNotes));
    }

    private boolean canAccessDepartment(IssueNote issueNote) {
        CustomUserDetails currentUser = SecurityUtils.getCurrentUser();

        if (currentUser.getRole() == UserRole.DEPARTMENT_STAFF
            || currentUser.getRole() == UserRole.DEPARTMENT_HEAD) {
            return issueNote.getRequisition().getDepartment().getId()
                .equals(currentUser.getDepartmentId());
        }

        return true;
    }

    private void checkDepartmentAccess(IssueNote issueNote) {
        if (!canAccessDepartment(issueNote)) {
            throw new AccessDeniedException("Bạn chỉ được xem chứng từ xuất của khoa/phòng mình");
        }
    }

    private IssueNoteResponse convertToResponse(IssueNote issueNote) {
        IssueNoteResponse response = new IssueNoteResponse();
        response.setId(issueNote.getId());
        response.setIssueNumber(issueNote.getIssueNumber());
        response.setIssueDate(issueNote.getIssueDate());

        response.setRequisitionId(issueNote.getRequisition().getId());
        response.setRequisitionNumber(issueNote.getRequisition().getRequisitionNumber());
        response.setDepartmentId(issueNote.getRequisition().getDepartment().getId());
        response.setDepartmentName(issueNote.getRequisition().getDepartment().getName());

        response.setIssuedById(issueNote.getIssuedBy().getId());
        response.setIssuedByName(issueNote.getIssuedBy().getFullName());
        response.setReceivedById(issueNote.getReceivedBy().getId());
        response.setReceivedByName(issueNote.getReceivedBy().getFullName());

        List<IssueNoteResponse.IssueNoteItemResponse> itemResponses =
            issueNote.getRequisition().getItems().stream()
                .map(item -> {
                    IssueNoteResponse.IssueNoteItemResponse itemResponse =
                        new IssueNoteResponse.IssueNoteItemResponse();
                    itemResponse.setMaterialId(item.getMaterial().getId());
                    itemResponse.setMaterialCode(item.getMaterial().getCode());
                    itemResponse.setMaterialName(item.getMaterial().getName());
                    itemResponse.setMaterialUnit(item.getMaterial().getUnit());
                    itemResponse.setQuantity(item.getIssuedQuantity() != null
                        ? item.getIssuedQuantity()
                        : item.getRequestedQuantity());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);

        return response;
    }
}
