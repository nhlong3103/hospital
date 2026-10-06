package com.hospital.service;

import com.hospital.entity.GoodsReceipt;
import com.hospital.entity.GoodsReceiptItem;
import com.hospital.enums.ReceiptStatus;

import java.time.LocalDate;
import java.util.List;

public interface GoodsReceiptService {
    
    GoodsReceipt createGoodsReceipt(GoodsReceipt receipt, List<GoodsReceiptItem> items);
    
    GoodsReceipt updateGoodsReceipt(Long id, GoodsReceipt receipt, List<GoodsReceiptItem> items);
    
    GoodsReceipt getGoodsReceiptById(Long id);
    
    GoodsReceipt getGoodsReceiptByInvoiceNumber(String invoiceNumber);
    
    List<GoodsReceipt> getAllGoodsReceipts();
    
    List<GoodsReceipt> getGoodsReceiptsByStatus(ReceiptStatus status);
    
    List<GoodsReceipt> getGoodsReceiptsBySupplier(Long supplierId);
    
    List<GoodsReceipt> getGoodsReceiptsByDateRange(LocalDate startDate, LocalDate endDate);
    
    GoodsReceipt confirmReceived(Long receiptId, Long receivedByUserId);
    
    GoodsReceipt verifyInvoice(Long receiptId, Long verifiedByUserId);
    
    GoodsReceipt finalizeReceipt(Long receiptId, Long finalizedByUserId);
    
    GoodsReceipt getReceiptForPaymentRequest(Long receiptId);

    void deleteGoodsReceipt(Long id);
}
