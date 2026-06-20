package com.pokemon_backend.project.service;

import com.pokemon_backend.project.entity.Card;
import com.pokemon_backend.project.entity.User;
import com.pokemon_backend.project.entity.UserCard;
import com.pokemon_backend.project.repository.CardRepository;
import com.pokemon_backend.project.repository.UserCardRepository;
import com.pokemon_backend.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class PackService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserCardRepository userCardRepository;

    private static final int COOLDOWN_HOURS = 4;
    private static final int CARDS_PER_PACK = 10;

    @Transactional
    public List<Card> openPack(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Verify Cooldown
        if (user.getLastPackOpenedAt() != null) {
            long hoursSinceLastPack = ChronoUnit.HOURS.between(user.getLastPackOpenedAt(), LocalDateTime.now());
            if (hoursSinceLastPack < COOLDOWN_HOURS) {
                throw new RuntimeException("You must wait " + (COOLDOWN_HOURS - hoursSinceLastPack) + " more hours.");
            }
        }

        // 2. Generate the Pack (Weighted RNG)
        List<Card> pulledCards = new ArrayList<>();

        // Slot 1-6: Commons
        pulledCards.addAll(cardRepository.findRandomCardsByExactRarity("Common", 6));

        // Slot 7-9: Uncommons
        pulledCards.addAll(cardRepository.findRandomCardsByExactRarity("Uncommon", 3));

        // Slot 10: The Rare Hit!
        pulledCards.addAll(cardRepository.findRandomRareCards(1));

        // Fallback safety check just in case your database lacks certain rarities
        if (pulledCards.size() < CARDS_PER_PACK) {
            int missing = CARDS_PER_PACK - pulledCards.size();
            pulledCards.addAll(cardRepository.findRandomCards(missing));
        }

        if (pulledCards.size() < CARDS_PER_PACK) {
            throw new RuntimeException("Not enough cards in the database to generate a pack!");
        }

        // 3. Add to User's Library
        for (Card card : pulledCards) {
            // Check if the user already owns this card
            UserCard inventoryItem = userCardRepository.findByUserAndCard(user, card)
                    .orElse(new UserCard());

            if (inventoryItem.getId() == null) {
                // New card! Set the relationships
                inventoryItem.setUser(user);
                inventoryItem.setCard(card);
                inventoryItem.setQuantity(1);
            } else {
                // Duplicate! Increment the quantity
                inventoryItem.setQuantity(inventoryItem.getQuantity() + 1);
            }

            userCardRepository.save(inventoryItem);
        }

        // 4. Reset the Timer
        user.setLastPackOpenedAt(LocalDateTime.now());
        userRepository.save(user);

        return pulledCards;
    }
}