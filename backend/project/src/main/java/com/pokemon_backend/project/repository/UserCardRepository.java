package com.pokemon_backend.project.repository;

import com.pokemon_backend.project.entity.Card;
import com.pokemon_backend.project.entity.User;
import com.pokemon_backend.project.entity.UserCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCardRepository extends JpaRepository<UserCard, Long> {
    List<UserCard> findAllByUser(User user);
    Optional<UserCard> findByUserAndCard(User user, Card card);
}