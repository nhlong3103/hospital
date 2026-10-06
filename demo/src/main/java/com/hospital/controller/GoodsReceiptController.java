package com.hospital.controller;

import com.hospital.dto.CreateGoodsReceiptRequest;
import com.hospital.dto.GoodsReceiptResponse;
import com.hospital.dto.PaymentRequestResponse;
import com.hospital.entity.GoodsReceipt;
import com.hospital.entity.GoodsReceiptItem;
import com.hospital.enums.ReceiptStatus;
import com.hospital.response.ApiResponse;
import com.hospital.security.SecurityUtils;
import com.hospital.service.GoodsReceiptService;
import com.hospital.service.MaterialService;
import com.hospital.service.SupplierService;
import com.hospital.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/goods-receipts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Goods Receipt Management", description = "APIs quản lý phiếu nhập kho")
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;
    private final SupplierService supplierService;
    private final UserService userService;
    private final MaterialService materialService;

    @PostMapping
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Lập sổ kiểm nhập hàng hóa - tạo phiếu nhập kho mới (DRAFT)")
    public ResponseEntity<ApiResponse<GoodsReceiptResponse>> createGoodsReceipt(
            @Valid @RequestBody CreateGoodsReceiptRequest request) {

        log.info("Creating new goods receipt for supplier: {}", request.getSupplierId());

        GoodsReceipt receipt = new GoodsReceipt();
        receipt.setReceiptDate(request.getReceiptDate());
        receipt.setSupplier(supplierService.getSupplierById(request.getSupplierId()));
        receipt.setInvoiceNumber(request.getInvoiceNumber());
        receipt.setReceivedBy(userService.getUserById(SecurityUtils.getCurrentUserId()));

        List<GoodsReceiptItem> items = request.getItems().stream()
            .map(itemDto -> {
                GoodsReceiptItem item = new GoodsReceiptItem();
                item.setMaterial(materialService.getMaterialById(itemDto.getMaterialId()));
                item.setQuantity(itemDto.getQuantity());
                item.setUnitPrice(itemDto.getUnitPrice());
                item.setBatchNumber(itemDto.getBatchNumber());
                item.setExpiryDate(itemDto.getExpiryDate());
                return item;
            })
            .collect(Collectors.toList());

        GoodsReceipt created = goodsReceiptService.createGoodsReceipt(receipt, items);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo phiếu nhập kho thành công", convertToResponse(created)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Lấy thông tin phiếu nhập kho theo ID")
    public ResponseEntity<ApiResponse<GoodsReceiptResponse>> getGoodsReceipt(@PathVariable Long id) {

        log.info("Getting goods receipt: {}", id);

        GoodsReceipt receipt = goodsReceiptService.getGoodsReceiptById(id);

        return ResponseEntity.ok(ApiResponse.success(convertToResponse(receipt)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Lấy danh sách tất cả phiếu nhập kho")
    public ResponseEntity<ApiResponse<List<GoodsReceiptResponse>>> getAllGoodsReceipts(
            @RequestParam(required = false) ReceiptStatus status,
            @RequestParam(required = false) Long supplierId) {

        log.info("Getting all goods receipts with status: {}, supplierId: {}",
            status, supplierId);

        List<GoodsReceipt> receipts;

        if (status != null) {
            receipts = goodsReceiptService.getGoodsReceiptsByStatus(status);
        } else if (supplierId != null) {
            receipts = goodsReceiptService.getGoodsReceiptsBySupplier(supplierId);
        } else {
            receipts = goodsReceiptService.getAllGoodsReceipts();
        }

        List<GoodsReceiptResponse> responses = receipts.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_KEEPER', 'WAREHOUSE_MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Lấy phiếu nhập kho theo khoảng thời gian")
    public ResponseEntity<ApiResponse<List<GoodsReceiptResponse>>> getGoodsReceiptsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Getting goods receipts from {} to {}", startDate, endDate);

        List<GoodsReceiptResponse> responses = goodsReceiptService
            .getGoodsReceiptsByDateRange(startDate, endDate).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping("/{id}/confirm-received")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Thủ kho giao phiếu kiểm nhập kèm hóa đơn cho kế toán (DRAFT → RECEIVED)")
    public ResponseEntity<ApiResponse<GoodsReceiptResponse>> confirmReceived(
            @PathVariable Long id) {

        Long receivedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Confirming goods received for receipt: {} by user: {}",
            id, receivedByUserId);

        GoodsReceipt receipt = goodsReceiptService.confirmReceived(id, receivedByUserId);

        return ResponseEntity.ok(ApiResponse.success(
            "Đã giao phiếu kiểm nhập cho kế toán", convertToResponse(receipt)));
    }

    @PostMapping("/{id}/verify-invoice")
    @PreAuthorize("hasRole('ACCOUNTANT')")
    @Operation(summary = "Kế toán kiểm tra hóa đơn (RECEIVED → VERIFIED)")
    public ResponseEntity<ApiResponse<GoodsReceiptResponse>> verifyInvoice(
            @PathVariable Long id) {

        Long verifiedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Verifying invoice for receipt: {} by user: {}", id, verifiedByUserId);

        GoodsReceipt receipt = goodsReceiptService.verifyInvoice(id, verifiedByUserId);

        return ResponseEntity.ok(ApiResponse.success(
            "Kiểm tra hóa đơn thành công", convertToResponse(receipt)));
    }

    @PostMapping("/{id}/finalize")
    @PreAuthorize("hasRole('WAREHOUSE_MANAGER')")
    @Operation(summary = "Trưởng VTTBYT hoàn tất thủ tục nhập kho (VERIFIED → FINALIZED)")
    public ResponseEntity<ApiResponse<GoodsReceiptResponse>> finalizeReceipt(
            @PathVariable Long id) {

        Long finalizedByUserId = SecurityUtils.getCurrentUserId();
        log.info("Finalizing receipt: {} by user: {}", id, finalizedByUserId);

        GoodsReceipt receipt = goodsReceiptService.finalizeReceipt(id, finalizedByUserId);

        return ResponseEntity.ok(ApiResponse.success(
            "Hoàn tất phiếu nhập kho thành công. Tồn kho đã được cập nhật.",
            convertToResponse(receipt)));
    }

    @GetMapping("/{id}/payment-request")
    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Lập phiếu đề nghị thanh toán từ phiếu nhập đã hoàn tất")
    public ResponseEntity<ApiResponse<PaymentRequestResponse>> getPaymentRequest(
            @PathVariable Long id) {

        log.info("Creating payment request for receipt: {}", id);

        GoodsReceipt receipt = goodsReceiptService.getReceiptForPaymentRequest(id);

        PaymentRequestResponse response = new PaymentRequestResponse();
        response.setReceiptId(receipt.getId());
        response.setRequestDate(LocalDate.now());
        response.setInvoiceNumber(receipt.getInvoiceNumber());
        response.setReceiptDate(receipt.getReceiptDate());
        response.setSupplierCode(receipt.getSupplier().getCode());
        response.setSupplierName(receipt.getSupplier().getName());
        response.setSupplierAddress(receipt.getSupplier().getAddress());
        response.setSupplierPhoneNumber(receipt.getSupplier().getPhoneNumber());
        response.setPreparedByName(SecurityUtils.getCurrentUser().getFullName());

        if (receipt.getFinalizedBy() != null) {
            response.setFinalizedByName(receipt.getFinalizedBy().getFullName());
        }

        GoodsReceiptResponse detail = convertToResponse(receipt);
        response.setItems(detail.getItems());
        response.setTotalAmount(detail.getTotalAmount());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('WAREHOUSE_KEEPER')")
    @Operation(summary = "Xóa phiếu nhập kho (chỉ khi DRAFT)")
    public ResponseEntity<ApiResponse<Void>> deleteGoodsReceipt(@PathVariable Long id) {

        log.info("Deleting goods receipt: {}", id);

        goodsReceiptService.deleteGoodsReceipt(id);

        return ResponseEntity.ok(ApiResponse.success("Xóa phiếu nhập kho thành công", null));
    }

    private GoodsReceiptResponse convertToResponse(GoodsReceipt receipt) {
        GoodsReceiptResponse response = new GoodsReceiptResponse();
        response.setId(receipt.getId());
        response.setReceiptDate(receipt.getReceiptDate());
        response.setInvoiceNumber(receipt.getInvoiceNumber());
        response.setStatus(receipt.getStatus());

        response.setSupplierId(receipt.getSupplier().getId());
        response.setSupplierName(receipt.getSupplier().getName());

        response.setReceivedById(receipt.getReceivedBy().getId());
        response.setReceivedByName(receipt.getReceivedBy().getFullName());

        if (receipt.getVerifiedBy() != null) {
            response.setVerifiedById(receipt.getVerifiedBy().getId());
            response.setVerifiedByName(receipt.getVerifiedBy().getFullName());
        }

        if (receipt.getFinalizedBy() != null) {
            response.setFinalizedById(receipt.getFinalizedBy().getId());
            response.setFinalizedByName(receipt.getFinalizedBy().getFullName());
        }

        List<GoodsReceiptResponse.GoodsReceiptItemResponse> itemResponses =
            receipt.getItems().stream()
                .map(item -> {
                    GoodsReceiptResponse.GoodsReceiptItemResponse itemResponse =
                        new GoodsReceiptResponse.GoodsReceiptItemResponse();
                    itemResponse.setId(item.getId());
                    itemResponse.setMaterialId(item.getMaterial().getId());
                    itemResponse.setMaterialCode(item.getMaterial().getCode());
                    itemResponse.setMaterialName(item.getMaterial().getName());
                    itemResponse.setMaterialUnit(item.getMaterial().getUnit());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setAmount(
                        item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                    itemResponse.setBatchNumber(item.getBatchNumber());
                    itemResponse.setExpiryDate(item.getExpiryDate());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);
        response.setTotalAmount(itemResponses.stream()
            .map(GoodsReceiptResponse.GoodsReceiptItemResponse::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add));

        return response;
    }
}
