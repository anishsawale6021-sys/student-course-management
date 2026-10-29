package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Optional: Add duplicate email check or password hashing logic here
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    // 1. Update Profile (Name & Phone) in MySQL
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

    // 2. Change & Save New Password in MySQL
    public boolean updatePassword(String email, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify current password match
            if (user.getPassword().equals(currentPassword)) {
                user.setPassword(newPassword);
                userRepository.save(user);
                return true;
            } else {
                throw new RuntimeException("Current password is incorrect!");
            }
        }
        throw new RuntimeException("User not found with email: " + email);
    }
}