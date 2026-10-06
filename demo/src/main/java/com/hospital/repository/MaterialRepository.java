package com.hospital.repository;

import com.hospital.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    
    Optional<Material> findByCode(String code);
    
    boolean existsByCode(String code);
    
    List<Material> findByCategory(String category);
    
    List<Material> findByNameContainingIgnoreCase(String name);
}
