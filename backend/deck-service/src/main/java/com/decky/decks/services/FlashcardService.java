package com.decky.decks.services;

import com.decky.decks.models.Flashcard;
import com.decky.decks.dtos.FlashcardDto;

import java.util.List;

public interface FlashcardService {

    List<Flashcard> findAll(String userId);

    List<Flashcard> findAllFromDeck(String deckId, String userId);

    long getDeckSize(String deckId, String userId);

    List<String> getAllDecks(String userId);

    List<Flashcard> getReviewBatch(String deckId, int newBatchSize, String userId);

    Flashcard createFlashcard(FlashcardDto.CreateRequest request, String userId);

    void deleteFlashcard(String deckId, String id, String userId);

    Flashcard update(String id, FlashcardDto.UpdateRequest request, String userId);

    Flashcard processReview(String id, String userId, int quality);
}
