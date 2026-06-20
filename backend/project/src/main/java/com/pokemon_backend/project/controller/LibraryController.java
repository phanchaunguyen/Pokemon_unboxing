package com.pokemon_backend.project.controller;

import com.pokemon_backend.project.dto.LibraryCardDTO;
import com.pokemon_backend.project.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = "*")
public class LibraryController {

    @Autowired
    private LibraryService libraryService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<LibraryCardDTO>> getLibrary(@PathVariable Long userId) {
        return ResponseEntity.ok(libraryService.getUserLibrary(userId));
    }
}