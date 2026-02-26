package com.decky.decks.repositories;

import com.decky.decks.models.Flashcard;
import org.springframework.data.domain.Limit;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends MongoRepository<Flashcard, String> {

    List<Flashcard> findAllByUserId(String userId);

    List<Flashcard> findAllByDeckIdAndUserId(String deckId, String userId);

    long countByDeckIdAndUserId(String deckId, String userId);

    List<Flashcard> findByDeckIdAndUserIdAndNextReviewDate(String deckId, String userId,
                                                           Integer nextReviewDate, Limit limit);

    List<Flashcard> findByDeckIdAndUserIdAndNextReviewDateLessThanEqual(String deckId,
                                                                        String userId, int date);

    @Aggregation(pipeline = {
            "{ '$match':  { 'userId': ?0 } }",
            "{ '$group':  { '_id': '$deckId' } }",
            "{ '$project': { '_id': 0, 'deckId': '$_id' } }"
    })
    List<String> findDistinctDeckIdsByUserId(String userId);
}
