package com.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "PurchasePlanItem")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchasePlanItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private PurchasePlan purchasePlan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;
    
    @Column(name = "requested_quantity", nullable = false)
    private Integer requestedQuantity;
    
    @Column(name = "estimated_price", precision = 15, scale = 2)
    private BigDecimal estimatedPrice;
}
