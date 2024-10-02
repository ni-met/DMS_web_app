package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Basic "))
            throw new IllegalArgumentException("Missing or invalid Authorization header");


        String base64Credentials = authorizationHeader.substring("Basic ".length()).trim();
        byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
        String credentials = new String(decodedBytes, StandardCharsets.UTF_8);

        String[] splitCredentials = credentials.split(":", 2);
        if (splitCredentials.length != 2) {
            throw new IllegalArgumentException("Invalid Authorization header format");
        }

        String email = splitCredentials[0];
        String password = splitCredentials[1];

        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(password, user.getPassword())) {
            return user.getRole().name();
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
