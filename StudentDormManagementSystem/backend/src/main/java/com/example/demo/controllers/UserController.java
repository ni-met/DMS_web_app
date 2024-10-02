package com.example.demo.controllers;

import com.example.demo.models.User;
import com.example.demo.dtos.UserDTO;
import com.example.demo.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User user = userService.getCurrentUser();
            if (user == null) return ResponseEntity.status(404).body("User not found");

            UserDTO userDTO = userService.toDTO(user);
            return ResponseEntity.ok(userDTO);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body("No authenticated user found");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO newUserDTO = userService.createNewUser(userDTO);
            return ResponseEntity.ok(newUserDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable(name = "email") String email) {
        try {
            userService.deleteUserByEmail(email);

            return ResponseEntity.ok("User with email " + email + " deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            UserDTO userDTO = userService.getUserByEmail(email);
            if (userDTO == null) return ResponseEntity.status(404).body("User not found");

            return ResponseEntity.ok(userDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/pass")
    public ResponseEntity<?> updatePassword(@RequestParam("credentials") String credentials) {
        try {

            UserDTO updatedUserDTO = userService.updatePassword(credentials);
            if (updatedUserDTO == null) return ResponseEntity.status(404).body("User not found");

            return ResponseEntity.ok("Password successfully updated!");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("An error occurred while changing password");
        }
    }
}
