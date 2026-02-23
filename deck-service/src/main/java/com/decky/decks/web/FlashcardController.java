package com.decky.decks.web;

import com.decky.decks.persistence.models.Flashcard;
import com.decky.decks.services.FlashcardService;
import com.decky.decks.web.dto.FlashcardDto;
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

    @PostMapping
    public ResponseEntity<Flashcard> create(
            @RequestBody Flashcard flashcard,
            Principal principal
    ) {
        String userId = principal.getName();
        Flashcard savedFlashcard = flashcardService.createFlashcard(flashcard, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFlashcard);
    }

    @GetMapping
    public ResponseEntity<List<Flashcard>> findAll(){
        return ResponseEntity.ok(flashcardService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            Principal principal
    ) {
        String userId = principal.getName();

        flashcardService.deleteFlashcard(id, userId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/review")
    public ResponseEntity<List<Flashcard>> getReviewBatch(
            @Valid @RequestBody FlashcardDto.ReviewBatchRequest request,
            Principal principal
    ){
      String userId = principal.getName();

      return ResponseEntity.ok(flashcardService.getReviewBatch(request.deck(), request.size(), userId));
    };

    @PutMapping("/{id}")
    public ResponseEntity<Flashcard> updateCard(
            @RequestBody Flashcard request,
            Principal principal){
        String userId = principal.getName();

        return ResponseEntity.ok(flashcardService.update(request,userId));
    }
}