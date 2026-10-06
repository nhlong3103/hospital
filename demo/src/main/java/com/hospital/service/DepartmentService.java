package com.hospital.service;

import com.hospital.entity.Department;

import java.util.List;

public interface DepartmentService {
    
    Department createDepartment(Department department);
    
    Department updateDepartment(Long id, Department department);
    
    Department getDepartmentById(Long id);
    
    Department getDepartmentByCode(String code);
    
    List<Department> getAllDepartments();
    
    Department assignHead(Long departmentId, Long userId);
    
    void deleteDepartment(Long id);
    
    boolean existsByCode(String code);
}
