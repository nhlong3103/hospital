package com.hospital.service.impl;

import com.hospital.entity.*;
import com.hospital.enums.ReceiptStatus;
import com.hospital.exception.BusinessException;
import com.hospital.exception.InvalidStatusTransitionException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import com.hospital.service.GoodsReceiptService;
import com.hospital.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GoodsReceiptServiceImpl implements GoodsReceiptService {
    
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final GoodsReceiptItemRepository goodsReceiptItemRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final StockService stockService;
    
    @Override
    public GoodsReceipt createGoodsReceipt(GoodsReceipt receipt, List<GoodsReceiptItem> items) {
        log.info("Creating new goods receipt for supplier: {}", receipt.getSupplier().getId());
        
        Supplier supplier = supplierRepository.findById(receipt.getSupplier().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", 
                receipt.getSupplier().getId()));
        
        User receivedBy = userRepository.findById(receipt.getReceivedBy().getId())
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", 
                receipt.getReceivedBy().getId()));
        
        if (goodsReceiptRepository.findByInvoiceNumber(receipt.getInvoiceNumber()).isPresent()) {
            throw new BusinessException("Số hóa đơn '" + receipt.getInvoiceNumber() + "' đã tồn tại");
        }
        
        receipt.setStatus(ReceiptStatus.DRAFT);
        receipt.setSupplier(supplier);
        receipt.setReceivedBy(receivedBy);
        
        GoodsReceipt savedReceipt = goodsReceiptRepository.save(receipt);
        
        for (GoodsReceiptItem item : items) {
            Material material = materialRepository.findById(item.getMaterial().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", 
                    item.getMaterial().getId()));
            
            item.setGoodsReceipt(savedReceipt);
            item.setMaterial(material);
            goodsReceiptItemRepository.save(item);
            savedReceipt.getItems().add(item);
        }

        log.info("Created goods receipt with id: {}", savedReceipt.getId());
        return savedReceipt;
    }
    
    @Override
    public GoodsReceipt updateGoodsReceipt(Long id, GoodsReceipt receipt, 
                                           List<GoodsReceiptItem> items) {
        log.info("Updating goods receipt with id: {}", id);
        
        GoodsReceipt existingReceipt = getGoodsReceiptById(id);
        
        if (existingReceipt.getStatus() != ReceiptStatus.DRAFT) {
            throw new InvalidStatusTransitionException(
                "Chỉ có thể cập nhật phiếu nhập ở trạng thái DRAFT");
        }
        
        existingReceipt.setReceiptDate(receipt.getReceiptDate());
        existingReceipt.setInvoiceNumber(receipt.getInvoiceNumber());
        
        goodsReceiptItemRepository.deleteAll(existingReceipt.getItems());
        existingReceipt.getItems().clear();
        
        for (GoodsReceiptItem item : items) {
            Material material = materialRepository.findById(item.getMaterial().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", "id", 
                    item.getMaterial().getId()));
            
            item.setGoodsReceipt(existingReceipt);
            item.setMaterial(material);
            goodsReceiptItemRepository.save(item);
        }
        
        return goodsReceiptRepository.save(existingReceipt);
    }
    
    @Override
    @Transactional(readOnly = true)
    public GoodsReceipt getGoodsReceiptById(Long id) {
        return goodsReceiptRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("GoodsReceipt", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public GoodsReceipt getGoodsReceiptByInvoiceNumber(String invoiceNumber) {
        return goodsReceiptRepository.findByInvoiceNumber(invoiceNumber)
            .orElseThrow(() -> new ResourceNotFoundException("GoodsReceipt", "invoiceNumber", 
                invoiceNumber));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceipt> getAllGoodsReceipts() {
        return goodsReceiptRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceipt> getGoodsReceiptsByStatus(ReceiptStatus status) {
        return goodsReceiptRepository.findByStatus(status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceipt> getGoodsReceiptsBySupplier(Long supplierId) {
        return goodsReceiptRepository.findBySupplierId(supplierId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceipt> getGoodsReceiptsByDateRange(LocalDate startDate, LocalDate endDate) {
        return goodsReceiptRepository.findByReceiptDateBetween(startDate, endDate);
    }
    
    @Override
    public GoodsReceipt confirmReceived(Long receiptId, Long receivedByUserId) {
        log.info("Confirming goods received for receipt: {}", receiptId);
        
        GoodsReceipt receipt = getGoodsReceiptById(receiptId);
        User receivedBy = userRepository.findById(receivedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", receivedByUserId));
        
        if (receipt.getStatus() != ReceiptStatus.DRAFT) {
            throw new InvalidStatusTransitionException(
                receipt.getStatus().toString(), ReceiptStatus.RECEIVED.toString());
        }
        
        receipt.setStatus(ReceiptStatus.RECEIVED);
        receipt.setReceivedBy(receivedBy);
        
        return goodsReceiptRepository.save(receipt);
    }
    
    @Override
    public GoodsReceipt verifyInvoice(Long receiptId, Long verifiedByUserId) {
        log.info("Verifying invoice for receipt: {}", receiptId);
        
        GoodsReceipt receipt = getGoodsReceiptById(receiptId);
        User verifiedBy = userRepository.findById(verifiedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", verifiedByUserId));
        
        if (receipt.getStatus() != ReceiptStatus.RECEIVED) {
            throw new InvalidStatusTransitionException(
                receipt.getStatus().toString(), ReceiptStatus.VERIFIED.toString());
        }
        
        receipt.setStatus(ReceiptStatus.VERIFIED);
        receipt.setVerifiedBy(verifiedBy);
        
        return goodsReceiptRepository.save(receipt);
    }
    
    @Override
    public GoodsReceipt finalizeReceipt(Long receiptId, Long finalizedByUserId) {
        log.info("Finalizing receipt: {}", receiptId);
        
        GoodsReceipt receipt = getGoodsReceiptById(receiptId);
        User finalizedBy = userRepository.findById(finalizedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", finalizedByUserId));
        
        if (receipt.getStatus() != ReceiptStatus.VERIFIED) {
            throw new InvalidStatusTransitionException(
                receipt.getStatus().toString(), ReceiptStatus.FINALIZED.toString());
        }
        
        for (GoodsReceiptItem item : receipt.getItems()) {
            stockService.addStock(
                item.getMaterial().getId(),
                item.getBatchNumber(),
                item.getQuantity(),
                item.getExpiryDate(),
                null
            );
        }
        
        receipt.setStatus(ReceiptStatus.FINALIZED);
        receipt.setFinalizedBy(finalizedBy);
        
        log.info("Successfully finalized receipt and updated stock");
        return goodsReceiptRepository.save(receipt);
    }
    
    @Override
    @Transactional(readOnly = true)
    public GoodsReceipt getReceiptForPaymentRequest(Long receiptId) {
        GoodsReceipt receipt = getGoodsReceiptById(receiptId);

        if (receipt.getStatus() != ReceiptStatus.FINALIZED) {
            throw new BusinessException(
                "Chỉ lập phiếu đề nghị thanh toán cho phiếu nhập đã hoàn tất");
        }

        return receipt;
    }

    @Override
    public void deleteGoodsReceipt(Long id) {
        log.info("Deleting goods receipt with id: {}", id);
        
        GoodsReceipt receipt = getGoodsReceiptById(id);
        
        if (receipt.getStatus() != ReceiptStatus.DRAFT) {
            throw new BusinessException(
                "Chỉ có thể xóa phiếu nhập ở trạng thái DRAFT");
        }
        
        goodsReceiptRepository.delete(receipt);
    }
}
