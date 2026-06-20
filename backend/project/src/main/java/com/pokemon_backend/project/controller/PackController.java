package com.pokemon_backend.project.controller;

import com.pokemon_backend.project.entity.Card;
import com.pokemon_backend.project.service.PackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packs")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows your Vite React app to talk to Spring Boot
public class PackController {

    @Autowired
    private PackService packService;

    @PostMapping("/open")
    public ResponseEntity<?> openPack(@RequestParam Long userId) {
        try {
            // Trigger the service logic (Cooldown check -> RNG -> Save to DB)
            List<Card> pulledCards = packService.openPack(userId);
            return ResponseEntity.ok(pulledCards);
        } catch (RuntimeException e) {
            // If the cooldown hasn't finished, send the error message back to React
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}