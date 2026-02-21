package com.decky.decks.persistence.repositories;

import com.decky.decks.persistence.models.Flashcard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends MongoRepository<Flashcard, String> {

    List<Flashcard> findByDeckId(String deckId);
    
    List<Flashcard> findByTagsContaining(String tag);

    long countByDeckId(String deckId);
}