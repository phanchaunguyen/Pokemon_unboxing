package com.pokemon_backend.project.component;

import com.fasterxml.jackson.databind.JsonNode;
import com.pokemon_backend.project.entity.Card;
import com.pokemon_backend.project.entity.User;
import com.pokemon_backend.project.repository.CardRepository;
import com.pokemon_backend.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CardRepository cardRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create a Test User if they don't exist
        if (userRepository.count() == 0) {
            System.out.println("🌱 Seeding Test User...");
            User testUser = new User();
            testUser.setUsername("AshKetchum");
            testUser.setPassword("password123");
            userRepository.save(testUser);
        }

        // 2. Fetch Pokémon Cards if the DB is empty
        if (cardRepository.count() == 0) {
            System.out.println("🌱 Seeding Pokémon Cards from API...");
            RestTemplate restTemplate = new RestTemplate();

            // Add any Set IDs you want here!
            // base1 = Base Set, sv3pt5 = 151, swsh7 = Evolving Skies, sm11 = Unified Minds
            String[] targetSets = {"base1", "sv3pt5", "swsh7"};
            List<Card> cardsToSave = new ArrayList<>();

            for (String setId : targetSets) {
                System.out.println("Fetching set: " + setId + "...");
                String apiUrl = "https://api.pokemontcg.io/v2/cards?q=set.id:" + setId;

                try {
                    JsonNode response = restTemplate.getForObject(apiUrl, JsonNode.class);
                    JsonNode dataArray = response.get("data");

                    for (JsonNode node : dataArray) {
                        Card card = new Card();
                        card.setId(node.get("id").asText());
                        card.setName(node.get("name").asText());
                        card.setImageUrl(node.get("images").get("small").asText());

                        if (node.has("rarity")) {
                            card.setRarity(node.get("rarity").asText());
                        } else {
                            card.setRarity("Common");
                        }

                        BigDecimal price = new BigDecimal("0.50");
                        if (node.has("tcgplayer") && node.get("tcgplayer").has("prices")) {
                            JsonNode prices = node.get("tcgplayer").get("prices");
                            if (prices.has("normal") && prices.get("normal").has("market")) {
                                price = BigDecimal.valueOf(prices.get("normal").get("market").asDouble());
                            } else if (prices.has("holofoil") && prices.get("holofoil").has("market")) {
                                price = BigDecimal.valueOf(prices.get("holofoil").get("market").asDouble());
                            }
                        }
                        card.setPrice(price);
                        cardsToSave.add(card);
                    }
                } catch (Exception e) {
                    System.err.println("❌ Failed to fetch set " + setId + ": " + e.getMessage());
                }
            }

            // Save all the accumulated cards at once
            cardRepository.saveAll(cardsToSave);
            System.out.println("✅ Successfully saved " + cardsToSave.size() + " cards to the database!");
        } else {
            System.out.println("⚡ Database already seeded. Skipping initialization.");
        }
    }



}