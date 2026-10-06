package com.hospital.repository;

import com.hospital.entity.RequisitionItem;
import com.hospital.enums.RequisitionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RequisitionItemRepository extends JpaRepository<RequisitionItem, Long> {
    
    List<RequisitionItem> findByRequisitionId(Long requisitionId);
    
    List<RequisitionItem> findByMaterialId(Long materialId);

    @Query("SELECT COALESCE(SUM(COALESCE(i.issuedQuantity, i.requestedQuantity)), 0) " +
           "FROM RequisitionItem i " +
           "WHERE i.material.id = :materialId AND i.requisition.status = :status " +
           "AND i.requisition.requisitionDate >= :fromDate")
    Long sumIssuedQuantitySince(@Param("materialId") Long materialId,
                                @Param("status") RequisitionStatus status,
                                @Param("fromDate") LocalDate fromDate);
}
