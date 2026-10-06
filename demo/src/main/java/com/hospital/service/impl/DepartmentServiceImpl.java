package com.hospital.service.impl;

import com.hospital.entity.Department;
import com.hospital.entity.User;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.UserRepository;
import com.hospital.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {
    
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    
    @Override
    public Department createDepartment(Department department) {
        log.info("Creating new department with code: {}", department.getCode());
        
        if (departmentRepository.existsByCode(department.getCode())) {
            throw new BusinessException("Mã khoa/phòng '" + department.getCode() + "' đã tồn tại");
        }
        
        return departmentRepository.save(department);
    }
    
    @Override
    public Department updateDepartment(Long id, Department department) {
        log.info("Updating department with id: {}", id);
        
        Department existingDepartment = getDepartmentById(id);
        
        if (!existingDepartment.getCode().equals(department.getCode()) 
            && departmentRepository.existsByCode(department.getCode())) {
            throw new BusinessException("Mã khoa/phòng '" + department.getCode() + "' đã tồn tại");
        }
        
        existingDepartment.setCode(department.getCode());
        existingDepartment.setName(department.getName());
        existingDepartment.setPhoneNumber(department.getPhoneNumber());

        return departmentRepository.save(existingDepartment);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Department getDepartmentByCode(String code) {
        return departmentRepository.findByCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("Department", "code", code));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
    @Override
    public Department assignHead(Long departmentId, Long userId) {
        log.info("Assigning head for department {}: user {}", departmentId, userId);
        
        Department department = getDepartmentById(departmentId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        department.setHeadUser(user);
        
        return departmentRepository.save(department);
    }
    
    @Override
    public void deleteDepartment(Long id) {
        log.info("Deleting department with id: {}", id);
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return departmentRepository.existsByCode(code);
    }
}
