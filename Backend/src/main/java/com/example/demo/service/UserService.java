package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Injected BCrypt encoder

    public User registerUser(User user) {
        // Hash the password before saving to the database
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Compare raw login password with the stored BCrypt hash
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    public User updateUserProfile(String email, String newName, String newPhone) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (newName != null && !newName.trim().isEmpty()) {
                user.setName(newName);
            }
            if (newPhone != null && !newPhone.trim().isEmpty()) {
                user.setPhone(newPhone);
            }
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with email: " + email);
    }

    public boolean updatePassword(String email, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify current password match using BCrypt matches
            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                // Hash and set the new password
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            } else {
                throw new RuntimeException("Current password is incorrect!");
            }
        }
        throw new RuntimeException("User not found with email: " + email);
    }
}