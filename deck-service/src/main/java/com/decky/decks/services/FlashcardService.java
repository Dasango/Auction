package com.decky.decks.services;

import com.decky.decks.persistence.models.Flashcard;
import com.decky.decks.persistence.repositories.FlashcardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    public Flashcard createFlashcard(Flashcard flashcard, String userId) {
        flashcard.setUserId(userId);
        return flashcardRepository.save(flashcard);
    }

    public List<Flashcard> findAll(){
        return flashcardRepository.findAll();
    }

    public void deleteFlashcard(String id, String currentUserId) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard no encontrada"));

        if (!flashcard.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para eliminar esta flashcard");
        }

        flashcardRepository.delete(flashcard);
    }

    public List<Flashcard> getReviewBatch(String deckId, int newBatchSize, String currentUserId){

        List<Flashcard> oldOnes = flashcardRepository.findByDeckIdAndUserIdAndNextReviewDateLessThanEqual(deckId, currentUserId,0);

        List<Flashcard> newOnes = flashcardRepository.findByDeckIdAndUserIdAndNextReviewDate(deckId, currentUserId, null,Limit.of(newBatchSize));

        oldOnes.addAll(newOnes);

        return oldOnes;
    }

    public Flashcard update(Flashcard updatedCard, String userId){
        updatedCard.setUserId(userId);
        return flashcardRepository.save(updatedCard);
    }
}