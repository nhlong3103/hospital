package com.hospital.service.impl;

import com.hospital.entity.User;
import com.hospital.enums.AccountStatus;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtService;
import com.hospital.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public User authenticate(String email, String password) {
        log.info("Authenticating user: {}", email);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsException("Email hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng");
        }

        if (user.getStatus() == AccountStatus.LOCKED) {
            throw new LockedException("Tài khoản đã bị khóa");
        }

        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw new DisabledException("Tài khoản không còn hoạt động");
        }

        return user;
    }

    @Override
    public String generateToken(User user) {
        return jwtService.generateToken(user);
    }

    @Override
    public long getTokenExpirationMs() {
        return jwtService.getExpirationMs();
    }
}
