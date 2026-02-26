package com.decky.decks.services.impl;

import com.decky.decks.models.Flashcard;
import com.decky.decks.repositories.FlashcardRepository;
import com.decky.decks.dtos.FlashcardDto;
import com.decky.decks.services.FlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Limit;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardServiceImpl implements FlashcardService {

    private final FlashcardRepository flashcardRepository;

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private Flashcard findAndAuthorize(String id, String userId, String action) {
        Flashcard card = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard no encontrada"));
        if (!card.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No tienes permiso para " + action + " esta flashcard");
        }
        return card;
    }

    // ── Queries ──────────────────────────────────────────────────────────────────

    public List<Flashcard> findAll(String userId) {
        return flashcardRepository.findAllByUserId(userId);
    }

    public List<Flashcard> findAllFromDeck(String deckId, String userId) {
        return flashcardRepository.findAllByDeckIdAndUserId(deckId, userId);
    }

    @Cacheable(value = "deckSize", key = "#deckId + ':' + #userId")
    public long getDeckSize(String deckId, String userId) {
        return flashcardRepository.countByDeckIdAndUserId(deckId, userId);
    }

    public List<String> getAllDecks(String userId) {
        return flashcardRepository.findDistinctDeckIdsByUserId(userId);
    }

    public List<Flashcard> getReviewBatch(String deckId, int newBatchSize, String userId) {
        List<Flashcard> due = flashcardRepository
                .findByDeckIdAndUserIdAndNextReviewDateLessThanEqual(deckId, userId,
                        (int) java.time.LocalDate.now().toEpochDay());

        List<Flashcard> fresh = flashcardRepository
                .findByDeckIdAndUserIdAndNextReviewDate(deckId, userId, null, Limit.of(newBatchSize));

        due.addAll(fresh);
        return due;
    }

    // ── Mutations ────────────────────────────────────────────────────────────────

    @CacheEvict(value = "deckSize", key = "#request.deckId() + ':' + #userId")
    public Flashcard createFlashcard(FlashcardDto.CreateRequest request, String userId) {
        Flashcard card = Flashcard.builder()
                .userId(userId)
                .deckId(request.deckId())
                .frontText(request.frontText())
                .backText(request.backText())
                .tags(request.tags())
                .extraInfo(request.extraInfo())
                .build();
        return flashcardRepository.save(card);
    }

    @CacheEvict(value = "deckSize", key = "#deckId + ':' + #userId")
    public void deleteFlashcard(String deckId, String id, String userId) {
        Flashcard card = findAndAuthorize(id, userId, "eliminar");
        flashcardRepository.delete(card);
    }

    public Flashcard update(String id, FlashcardDto.UpdateRequest request, String userId) {
        Flashcard card = findAndAuthorize(id, userId, "actualizar");
        card.setFrontText(request.frontText());
        card.setBackText(request.backText());
        card.setTags(request.tags());
        card.setExtraInfo(request.extraInfo());
        return flashcardRepository.save(card);
    }

    public Flashcard processReview(String id, String userId, int quality) {
        Flashcard card = findAndAuthorize(id, userId, "editar");

        if (quality < 0 || quality > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Calidad de repaso debe estar entre 0 y 5");
        }

        int repetitions = card.getRepetitions() != null ? card.getRepetitions() : 0;
        double easeFactor = card.getEaseFactor() != null ? card.getEaseFactor() : 2.5;
        int interval = card.getInterval() != null ? card.getInterval() : 0;

        if (quality >= 3) {
            interval = switch (repetitions) {
                case 0 -> 1;
                case 1 -> 6;
                default -> (int) Math.round(interval * easeFactor);
            };
            repetitions++;
        } else {
            repetitions = 0;
            interval = 1;
        }

        easeFactor = Math.max(1.3,
                easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

        card.setRepetitions(repetitions);
        card.setEaseFactor(easeFactor);
        card.setInterval(interval);
        card.setNextReviewDate((int) java.time.LocalDate.now().toEpochDay() + interval);

        return flashcardRepository.save(card);
    }
}
