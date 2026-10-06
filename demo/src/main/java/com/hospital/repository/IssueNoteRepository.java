package com.hospital.repository;

import com.hospital.entity.IssueNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueNoteRepository extends JpaRepository<IssueNote, Long> {
    
    Optional<IssueNote> findByIssueNumber(String issueNumber);
    
    Optional<IssueNote> findByRequisitionId(Long requisitionId);
    
    List<IssueNote> findByIssueDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<IssueNote> findByIssuedById(Long userId);
    
    List<IssueNote> findByReceivedById(Long userId);
}
