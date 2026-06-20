package com.pokemon_backend.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class LibraryCardDTO {
    private String cardId;
    private String name;
    private String imageUrl;
    private String rarity;
    private BigDecimal price;
    private int quantity;
}