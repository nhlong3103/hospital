package com.hospital.service;

import com.hospital.entity.IssueNote;

import java.time.LocalDate;
import java.util.List;

public interface IssueNoteService {
    
    IssueNote createIssueNote(Long requisitionId, Long issuedByUserId, Long receivedByUserId);
    
    IssueNote getIssueNoteById(Long id);
    
    IssueNote getIssueNoteByNumber(String issueNumber);
    
    IssueNote getIssueNoteByRequisition(Long requisitionId);
    
    List<IssueNote> getAllIssueNotes();
    
    List<IssueNote> getIssueNotesByDateRange(LocalDate startDate, LocalDate endDate);
    
    List<IssueNote> getIssueNotesByIssuedBy(Long userId);
    
    List<IssueNote> getIssueNotesByReceivedBy(Long userId);
    
    String generateIssueNumber();
}
