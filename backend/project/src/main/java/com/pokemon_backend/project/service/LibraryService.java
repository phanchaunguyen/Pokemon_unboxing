package com.pokemon_backend.project.service;

import com.pokemon_backend.project.dto.LibraryCardDTO;
import com.pokemon_backend.project.entity.User;
import com.pokemon_backend.project.entity.UserCard;
import com.pokemon_backend.project.repository.UserCardRepository;
import com.pokemon_backend.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    @Autowired
    private UserCardRepository userCardRepository;

    @Autowired
    private UserRepository userRepository;

    public List<LibraryCardDTO> getUserLibrary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserCard> userCards = userCardRepository.findAllByUser(user);

        // Convert the database entities into safe, flat DTOs for the frontend
        return userCards.stream().map(uc -> new LibraryCardDTO(
                uc.getCard().getId(),
                uc.getCard().getName(),
                uc.getCard().getImageUrl(),
                uc.getCard().getRarity(),
                uc.getCard().getPrice(),
                uc.getQuantity()
        )).collect(Collectors.toList());
    }
}