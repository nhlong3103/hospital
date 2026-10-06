package com.hospital.service.impl;

import com.hospital.entity.User;
import com.hospital.enums.AccountStatus;
import com.hospital.enums.UserRole;
import com.hospital.exception.BusinessException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.UserRepository;
import com.hospital.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(User user) {
        log.info("Creating new user with email: {}", user.getEmail());
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("Email '" + user.getEmail() + "' đã tồn tại");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getStatus() == null) {
            user.setStatus(AccountStatus.ACTIVE);
        }
        
        return userRepository.save(user);
    }
    
    @Override
    public User updateUser(Long id, User user) {
        log.info("Updating user with id: {}", id);
        
        User existingUser = getUserById(id);
        
        if (!existingUser.getEmail().equals(user.getEmail()) 
            && userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("Email '" + user.getEmail() + "' đã tồn tại");
        }
        
        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        existingUser.setDepartment(user.getDepartment());
        
        return userRepository.save(existingUser);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getUsersByDepartment(Long departmentId) {
        return userRepository.findByDepartmentId(departmentId);
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        log.info("Changing password for user: {}", userId);
        
        User user = getUserById(userId);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BusinessException("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    @Override
    public void resetPassword(Long userId, String newPassword) {
        log.info("Resetting password for user: {}", userId);

        User user = getUserById(userId);
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }
    
    @Override
    public User updateAccountStatus(Long userId, AccountStatus status) {
        log.info("Updating account status for user {}: {}", userId, status);
        
        User user = getUserById(userId);
        user.setStatus(status);
        
        return userRepository.save(user);
    }
    
    @Override
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);
        User user = getUserById(id);
        userRepository.delete(user);
    }

	@Override
	@Transactional(readOnly = true)
	public List<User> getUsersByRoleAndStatus(UserRole role, AccountStatus status) {
		return userRepository.findByRoleAndStatus(role, status);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean existsByEmail(String email) {
		return userRepository.existsByEmail(email);
	}
}
