package com.decky.decks.controllers;

import com.decky.decks.models.Flashcard;
import com.decky.decks.services.FlashcardService;
import com.decky.decks.dtos.FlashcardDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    // ── Global ───────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<Flashcard>> findAll(Principal principal) {
        return ResponseEntity.ok(flashcardService.findAll(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<Flashcard> create(
            @Valid @RequestBody FlashcardDto.CreateRequest request,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(flashcardService.createFlashcard(request, principal.getName()));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<Flashcard>> createBatch(
            @Valid @RequestBody FlashcardDto.BatchCreateRequest request,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(flashcardService.createFlashcards(request, principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flashcard> update(
            @PathVariable String id,
            @Valid @RequestBody FlashcardDto.UpdateRequest request,
            Principal principal) {
        return ResponseEntity.ok(flashcardService.update(id, request, principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flashcard> findById(
            @PathVariable String id,
            Principal principal) {
        return ResponseEntity.ok(flashcardService.findById(id, principal.getName()));
    }

    @DeleteMapping("/{deckId}/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String deckId,
            @PathVariable String id,
            Principal principal) {
        flashcardService.deleteFlashcard(deckId, id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // ── Deck-scoped ──────────────────────────────────────────────────────────────

    @GetMapping("/decks")
    public ResponseEntity<List<String>> getAllDecks(Principal principal) {
        return ResponseEntity.ok(flashcardService.getAllDecks(principal.getName()));
    }

    @GetMapping("/deck/{deckId}")
    public ResponseEntity<List<Flashcard>> findAllFromDeck(
            @PathVariable String deckId,
            Principal principal) {
        return ResponseEntity.ok(flashcardService.findAllFromDeck(deckId, principal.getName()));
    }

    @GetMapping("/deck/{deckId}/size")
    public ResponseEntity<FlashcardDto.DeckSizeResponse> getDeckSize(
            @PathVariable String deckId,
            Principal principal) {
        return ResponseEntity.ok(
                new FlashcardDto.DeckSizeResponse(deckId, flashcardService.getDeckSize(deckId, principal.getName())));
    }

    // ── Review ───────────────────────────────────────────────────────────────────

    @PostMapping("/review")
    public ResponseEntity<List<Flashcard>> getReviewBatch(
            @Valid @RequestBody FlashcardDto.ReviewBatchRequest request,
            Principal principal) {
        return ResponseEntity.ok(
                flashcardService.getReviewBatch(request.deck(), request.size(), principal.getName()));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<Flashcard> processReview(
            @PathVariable String id,
            @RequestParam int quality,
            Principal principal) {
        return ResponseEntity.ok(flashcardService.processReview(id, principal.getName(), quality));
    }
}
