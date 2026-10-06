package com.hospital.repository;

import com.hospital.entity.User;
import com.hospital.enums.AccountStatus;
import com.hospital.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByStatus(AccountStatus status);
    
    List<User> findByDepartmentId(Long departmentId);
    
    List<User> findByRoleAndStatus(UserRole role, AccountStatus status);
}
