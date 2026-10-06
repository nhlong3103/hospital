package com.hospital.service;

import com.hospital.entity.Material;

import java.util.List;

public interface MaterialService {
    
    Material createMaterial(Material material);
    
    Material updateMaterial(Long id, Material material);
    
    Material getMaterialById(Long id);
    
    Material getMaterialByCode(String code);
    
    List<Material> getAllMaterials();
    
    List<Material> searchMaterialsByName(String name);
    
    List<Material> getMaterialsByCategory(String category);
    
    void deleteMaterial(Long id);
    
    boolean existsByCode(String code);
}
