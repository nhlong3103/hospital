package com.hospital.service.impl;

import com.hospital.entity.Material;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MaterialRepository;
import com.hospital.service.MaterialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MaterialServiceImpl implements MaterialService {
    
    private final MaterialRepository materialRepository;
    
    @Override
    public Material createMaterial(Material material) {
        log.info("Creating new material with code: {}", material.getCode());
        
        if (materialRepository.existsByCode(material.getCode())) {
            throw new BusinessException("Mã vật tư '" + material.getCode() + "' đã tồn tại");
        }
        
        return materialRepository.save(material);
    }
    
    @Override
    public Material updateMaterial(Long id, Material material) {
        log.info("Updating material with id: {}", id);
        
        Material existingMaterial = getMaterialById(id);
        
        if (!existingMaterial.getCode().equals(material.getCode()) 
            && materialRepository.existsByCode(material.getCode())) {
            throw new BusinessException("Mã vật tư '" + material.getCode() + "' đã tồn tại");
        }
        
        existingMaterial.setCode(material.getCode());
        existingMaterial.setName(material.getName());
        existingMaterial.setUnit(material.getUnit());
        existingMaterial.setManufacturer(material.getManufacturer());
        existingMaterial.setCategory(material.getCategory());
        
        return materialRepository.save(existingMaterial);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Material getMaterialById(Long id) {
        return materialRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Material", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Material getMaterialByCode(String code) {
        return materialRepository.findByCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("Material", "code", code));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Material> searchMaterialsByName(String name) {
        return materialRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Material> getMaterialsByCategory(String category) {
        return materialRepository.findByCategory(category);
    }
    
    @Override
    public void deleteMaterial(Long id) {
        log.info("Deleting material with id: {}", id);
        
        Material material = getMaterialById(id);
        materialRepository.delete(material);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return materialRepository.existsByCode(code);
    }
}
