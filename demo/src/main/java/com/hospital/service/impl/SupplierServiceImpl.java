package com.hospital.service.impl;

import com.hospital.entity.Supplier;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.SupplierRepository;
import com.hospital.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SupplierServiceImpl implements SupplierService {
    
    private final SupplierRepository supplierRepository;
    
    @Override
    public Supplier createSupplier(Supplier supplier) {
        log.info("Creating new supplier with code: {}", supplier.getCode());
        
        if (supplierRepository.existsByCode(supplier.getCode())) {
            throw new BusinessException("Mã nhà cung cấp '" + supplier.getCode() + "' đã tồn tại");
        }
        
        return supplierRepository.save(supplier);
    }
    
    @Override
    public Supplier updateSupplier(Long id, Supplier supplier) {
        log.info("Updating supplier with id: {}", id);
        
        Supplier existingSupplier = getSupplierById(id);
        
        if (!existingSupplier.getCode().equals(supplier.getCode()) 
            && supplierRepository.existsByCode(supplier.getCode())) {
            throw new BusinessException("Mã nhà cung cấp '" + supplier.getCode() + "' đã tồn tại");
        }
        
        existingSupplier.setCode(supplier.getCode());
        existingSupplier.setName(supplier.getName());
        existingSupplier.setPhoneNumber(supplier.getPhoneNumber());
        existingSupplier.setEmail(supplier.getEmail());
        existingSupplier.setAddress(supplier.getAddress());
        
        return supplierRepository.save(existingSupplier);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Supplier getSupplierByCode(String code) {
        return supplierRepository.findByCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("Supplier", "code", code));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Supplier> searchSuppliersByName(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Override
    public void deleteSupplier(Long id) {
        log.info("Deleting supplier with id: {}", id);
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return supplierRepository.existsByCode(code);
    }
}
