package com.pokemon_backend.project.repository;

import com.pokemon_backend.project.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, String> {
    // We will use this to grab a pool of cards to pull from
    List<Card> findByRarity(String rarity);

    // A quick way to get random cards directly from the database
    @Query(value = "SELECT * FROM cards ORDER BY RANDOM() LIMIT ?1", nativeQuery = true)
    List<Card> findRandomCards(int limit);

    // Grab exact rarities (for Commons and Uncommons)
    @Query(value = "SELECT * FROM cards WHERE rarity = ?1 ORDER BY RANDOM() LIMIT ?2", nativeQuery = true)
    List<Card> findRandomCardsByExactRarity(String rarity, int limit);

    // Grab the "Rare Slot" (Anything that ISN'T Common or Uncommon, e.g., Holo, Secret Rare, Illustration Rare)
    @Query(value = "SELECT * FROM cards WHERE rarity NOT IN ('Common', 'Uncommon') ORDER BY RANDOM() LIMIT ?1", nativeQuery = true)
    List<Card> findRandomRareCards(int limit);
}