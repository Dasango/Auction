package com.decky.decks.controllers;

import com.decky.decks.models.Flashcard;
import com.decky.decks.services.FlashcardService;
import com.decky.decks.dtos.FlashcardDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    // ── Global ───────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<Flashcard>> findAll(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(flashcardService.findAll(userId));
    }

    @PostMapping
    public ResponseEntity<Flashcard> create(
            @Valid @RequestBody FlashcardDto.CreateRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(flashcardService.createFlashcard(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flashcard> update(
            @PathVariable String id,
            @Valid @RequestBody FlashcardDto.UpdateRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(flashcardService.update(id, request, userId));
    }

    @DeleteMapping("/{deckId}/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String deckId,
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        flashcardService.deleteFlashcard(deckId, id, userId);
        return ResponseEntity.noContent().build();
    }

    // ── Deck-scoped ──────────────────────────────────────────────────────────────

    @GetMapping("/decks")
    public ResponseEntity<List<String>> getAllDecks(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(flashcardService.getAllDecks(userId));
    }

    @GetMapping("/deck/{deckId}")
    public ResponseEntity<List<Flashcard>> findAllFromDeck(
            @PathVariable String deckId,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(flashcardService.findAllFromDeck(deckId, userId));
    }

    @GetMapping("/deck/{deckId}/size")
    public ResponseEntity<FlashcardDto.DeckSizeResponse> getDeckSize(
            @PathVariable String deckId,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(
                new FlashcardDto.DeckSizeResponse(deckId, flashcardService.getDeckSize(deckId, userId)));
    }

    // ── Review ───────────────────────────────────────────────────────────────────

    @PostMapping("/review")
    public ResponseEntity<List<Flashcard>> getReviewBatch(
            @Valid @RequestBody FlashcardDto.ReviewBatchRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(
                flashcardService.getReviewBatch(request.deck(), request.size(), userId));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<Flashcard> processReview(
            @PathVariable String id,
            @RequestParam int quality,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(flashcardService.processReview(id, userId, quality));
    }
}
