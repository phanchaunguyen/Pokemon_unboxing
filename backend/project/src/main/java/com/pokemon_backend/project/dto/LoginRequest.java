package com.pokemon_backend.project.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}