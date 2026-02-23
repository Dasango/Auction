package com.decky.decks.persistence.repositories;

import com.decky.decks.persistence.models.Flashcard;
import org.springframework.data.domain.Limit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.List;

@Repository
public interface FlashcardRepository extends MongoRepository<Flashcard, String> {

    List<Flashcard> findByDeckId(String deckId);

    List<Flashcard> findAllByUserId(String userId);

    List<Flashcard> findByTagsContaining(String tag);

    long countByDeckId(String deckId);

    List<Flashcard> findByDeckIdAndUserIdAndNextReviewDate(String deckId, String userId, Integer nextReviewDate,
            Limit limit);

    List<Flashcard> findByDeckIdAndUserIdAndNextReviewDateLessThanEqual(String deckId, String userId, int i);
}