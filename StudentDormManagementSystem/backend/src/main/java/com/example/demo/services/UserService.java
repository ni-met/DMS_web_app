package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.dtos.UserDTO;
import com.example.demo.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }

    public UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());

        return userDTO;
    }

    public User toEntity(UserDTO userDTO) {
        User user = new User();

        user.setEmail(userDTO.getEmail());
        user.setPassword(this.bCryptPasswordEncoder.encode(userDTO.getEmail()));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setRole(User.Role.STUDENT);

        return userRepository.save(user);
    }

    public String transformParameter(String parameter) {
        if (parameter != null) {
            parameter = parameter.trim();
            if (parameter.isEmpty()) {
                parameter = null;
            }
        }
        return parameter;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new IllegalStateException("No authenticated user found");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        Optional<User> userOptional = userRepository.findUserByEmail(email);

        if (userOptional.isEmpty()) throw new EntityNotFoundException("User not found");

        User user = userOptional.get();

        return user;
    }

    public UserDTO updatePassword(String credentials) {
        if (credentials == null)
            throw new IllegalArgumentException("Missing or invalid credentials");

        String base64Credentials = credentials.trim();
        byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
        String decodedCredentials = new String(decodedBytes, StandardCharsets.UTF_8);

        String[] splitCredentials = decodedCredentials.split(":", 2);

        if (splitCredentials.length != 2)
            throw new IllegalArgumentException("Invalid credentials format");

        String oldPassword = splitCredentials[0];
        String newPassword = splitCredentials[1];

        User user = getCurrentUser();

        if (!bCryptPasswordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid old password");
        }

        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password length should be at least 6 symbols");
        }

        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);

        return toDTO(user);
    }

    @Transactional
    public UserDTO createNewUser(UserDTO userDTO) {
        if (userDTO == null) throw new IllegalArgumentException("No data to create new user with");

        Optional<User> userOptional = userRepository.findUserByEmail(userDTO.getEmail());
        if (!userOptional.isEmpty())
            throw new IllegalArgumentException("This email is already taken");

        User user = toEntity(userDTO);
        userRepository.save(user);

        return toDTO(user);
    }

    public void deleteUserByEmail(String email) {
        if (email == null || email.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional == null) throw new EntityNotFoundException("User not found");

        User user = userOptional.get();
        userRepository.delete(user);
    }

    public UserDTO getUserByEmail(String email) {
        if (email == null || email.trim().isEmpty()) throw new IllegalArgumentException("Email should have value");

        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional.isEmpty()) throw new EntityNotFoundException("User not found");

        User user = userOptional.get();

        return toDTO(user);
    }

    public void checkIfStudent(String facultyNumber) {
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        User currentUser = getCurrentUser();
        if (currentUser.getRole().equals(User.Role.STUDENT)) {
            if (!currentUser.getStudent().getFacultyNumber().equals(facultyNumber)) {
                throw new AccessDeniedException("You can only access your own resources.");
            }
        }
    }

}
