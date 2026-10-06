package com.hospital.service.impl;

import com.hospital.entity.IssueNote;
import com.hospital.entity.Requisition;
import com.hospital.entity.User;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.IssueNoteRepository;
import com.hospital.repository.RequisitionRepository;
import com.hospital.repository.UserRepository;
import com.hospital.service.IssueNoteService;
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
public class IssueNoteServiceImpl implements IssueNoteService {
    
    private final IssueNoteRepository issueNoteRepository;
    private final RequisitionRepository requisitionRepository;
    private final UserRepository userRepository;
    
    @Override
    public IssueNote createIssueNote(Long requisitionId, Long issuedByUserId, Long receivedByUserId) {
        log.info("Creating issue note for requisition: {}", requisitionId);
        
        Requisition requisition = requisitionRepository.findById(requisitionId)
            .orElseThrow(() -> new ResourceNotFoundException("Requisition", "id", requisitionId));
        
        if (issueNoteRepository.findByRequisitionId(requisitionId).isPresent()) {
            throw new BusinessException(
                "Chứng từ xuất kho đã tồn tại cho phiếu lĩnh này");
        }
        
        User issuedBy = userRepository.findById(issuedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", issuedByUserId));
        User receivedBy = userRepository.findById(receivedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", receivedByUserId));
        
        IssueNote issueNote = new IssueNote();
        issueNote.setIssueNumber(generateIssueNumber());
        issueNote.setRequisition(requisition);
        issueNote.setIssueDate(LocalDate.now());
        issueNote.setIssuedBy(issuedBy);
        issueNote.setReceivedBy(receivedBy);
        
        IssueNote saved = issueNoteRepository.save(issueNote);
        log.info("Created issue note with number: {}", saved.getIssueNumber());
        
        return saved;
    }
    
    @Override
    @Transactional(readOnly = true)
    public IssueNote getIssueNoteById(Long id) {
        return issueNoteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("IssueNote", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public IssueNote getIssueNoteByNumber(String issueNumber) {
        return issueNoteRepository.findByIssueNumber(issueNumber)
            .orElseThrow(() -> new ResourceNotFoundException("IssueNote", "issueNumber", 
                issueNumber));
    }
    
    @Override
    @Transactional(readOnly = true)
    public IssueNote getIssueNoteByRequisition(Long requisitionId) {
        return issueNoteRepository.findByRequisitionId(requisitionId)
            .orElseThrow(() -> new ResourceNotFoundException("IssueNote", "requisitionId", 
                requisitionId));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<IssueNote> getAllIssueNotes() {
        return issueNoteRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<IssueNote> getIssueNotesByDateRange(LocalDate startDate, LocalDate endDate) {
        return issueNoteRepository.findByIssueDateBetween(startDate, endDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<IssueNote> getIssueNotesByIssuedBy(Long userId) {
        return issueNoteRepository.findByIssuedById(userId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<IssueNote> getIssueNotesByReceivedBy(Long userId) {
        return issueNoteRepository.findByReceivedById(userId);
    }
    
    @Override
    public String generateIssueNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        LocalDate today = LocalDate.now();
        List<IssueNote> todayIssueNotes = issueNoteRepository
            .findByIssueDateBetween(today, today);
        
        int sequence = todayIssueNotes.size() + 1;
        
        return String.format("XK-%s-%03d", dateStr, sequence);
    }
}
