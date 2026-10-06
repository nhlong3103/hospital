package com.hospital.service;

import com.hospital.entity.User;
import com.hospital.enums.AccountStatus;
import com.hospital.enums.UserRole;

import java.util.List;

public interface UserService {
    
    User createUser(User user);
    
    User updateUser(Long id, User user);
    
    User getUserById(Long id);
    
    User getUserByEmail(String email);
    
    List<User> getAllUsers();
    
    List<User> getUsersByRole(UserRole role);
    
    List<User> getUsersByDepartment(Long departmentId);
    
    List<User> getUsersByRoleAndStatus(UserRole role, AccountStatus status);
    
    void changePassword(Long userId, String oldPassword, String newPassword);

    void resetPassword(Long userId, String newPassword);

    User updateAccountStatus(Long userId, AccountStatus status);
    
    void deleteUser(Long id);
    
    boolean existsByEmail(String email);
}
