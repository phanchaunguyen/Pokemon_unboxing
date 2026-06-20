package com.pokemon_backend.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
public class Card {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    private String rarity;

    // BigDecimal is best practice for handling money/prices in Java
    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    // TODO: Generate standard Getters and Setters for all fields
}