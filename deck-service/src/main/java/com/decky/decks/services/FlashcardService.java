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

    public List<Flashcard> findAll(String userId) {
        return flashcardRepository.findAllByUserId(userId);
    }

    public void deleteFlashcard(String id, String currentUserId) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard no encontrada"));

        if (!flashcard.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para eliminar esta flashcard");
        }

        flashcardRepository.delete(flashcard);
    }

    public List<Flashcard> getReviewBatch(String deckId, int newBatchSize, String currentUserId) {

        List<Flashcard> oldOnes = flashcardRepository.findByDeckIdAndUserIdAndNextReviewDateLessThanEqual(deckId,
                currentUserId, 0);

        List<Flashcard> newOnes = flashcardRepository.findByDeckIdAndUserIdAndNextReviewDate(deckId, currentUserId,
                null, Limit.of(newBatchSize));

        oldOnes.addAll(newOnes);

        return oldOnes;
    }

    public Flashcard update(String id, Flashcard request, String currentUserId) {
        Flashcard existing = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard no encontrada"));

        if (!existing.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para actualizar esta flashcard");
        }

        existing.setFrontText(request.getFrontText());
        existing.setBackText(request.getBackText());
        existing.setTags(request.getTags());
        existing.setExtraInfo(request.getExtraInfo());

        return flashcardRepository.save(existing);
    }

    public Flashcard processReview(String id, String currentUserId, int quality) {
        Flashcard card = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard no encontrada"));

        if (!card.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para editar esta flashcard");
        }

        if (quality < 0 || quality > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Calidad de repaso debe estar entre 0 y 5");
        }

        int repetitions = card.getRepetitions() != null ? card.getRepetitions() : 0;
        double easeFactor = card.getEaseFactor() != null ? card.getEaseFactor() : 2.5;
        int interval = card.getInterval() != null ? card.getInterval() : 0;

        if (quality >= 3) {
            if (repetitions == 0) {
                interval = 1;
            } else if (repetitions == 1) {
                interval = 6;
            } else {
                interval = (int) Math.round(interval * easeFactor);
            }
            repetitions++;
        } else {
            repetitions = 0;
            interval = 1;
        }

        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }

        card.setRepetitions(repetitions);
        card.setEaseFactor(easeFactor);
        card.setInterval(interval);

        int todayEpochDay = (int) java.time.LocalDate.now().toEpochDay();
        card.setNextReviewDate(todayEpochDay + interval);

        return flashcardRepository.save(card);
    }
}