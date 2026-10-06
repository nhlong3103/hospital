package com.hospital.service;

import com.hospital.entity.User;

public interface AuthService {

    User authenticate(String email, String password);

    String generateToken(User user);

    long getTokenExpirationMs();
}
