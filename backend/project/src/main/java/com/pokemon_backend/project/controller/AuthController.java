package com.pokemon_backend.project.controller;

import com.pokemon_backend.project.dto.LoginRequest;
import com.pokemon_backend.project.entity.User;
import com.pokemon_backend.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(request.getPassword())) {
            // Note: In a production app, you'd use BCrypt to check hashes.
            // Since you are manually typing passwords into Supabase, we are comparing plain text.
            return ResponseEntity.ok(userOpt.get().getId());
        }

        return ResponseEntity.status(401).body("Invalid username or password");
    }
}