package com.hospital.service;

import com.hospital.entity.Supplier;

import java.util.List;

public interface SupplierService {
    
    Supplier createSupplier(Supplier supplier);
    
    Supplier updateSupplier(Long id, Supplier supplier);
    
    Supplier getSupplierById(Long id);
    
    Supplier getSupplierByCode(String code);
    
    List<Supplier> getAllSuppliers();
    
    List<Supplier> searchSuppliersByName(String name);
    
    void deleteSupplier(Long id);
    
    boolean existsByCode(String code);
}
