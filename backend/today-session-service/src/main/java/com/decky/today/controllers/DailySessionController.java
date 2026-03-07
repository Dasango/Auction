package com.decky.today.controllers;

import com.decky.today.models.DailySession;
import com.decky.today.services.DailySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class DailySessionController {

    private final DailySessionService sessionService;

    @PostMapping
    public ResponseEntity<DailySession> createSession(@RequestBody DailySession session,
            @RequestHeader("X-User-Id") String userId) {
        session.setUserId(userId);
        DailySession savedSession = sessionService.saveSession(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSession);
    }

    @GetMapping
    public ResponseEntity<DailySession> getSession(
            @RequestParam("deckId") String deckId,
            @RequestParam(value = "batchSize", defaultValue = "20") int batchSize,
            @RequestHeader("X-User-Id") String userId) {
        return sessionService.getSession(userId, deckId, batchSize)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{cardId}/review")
    public ResponseEntity<Void> processReview(
            @PathVariable("cardId") String cardId,
            @RequestParam("quality") int quality,
            @RequestParam(value = "deckId", required = false) String deckId,
            @RequestHeader("X-User-Id") String userId) {
        sessionService.processReview(userId, deckId, cardId, quality);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteSession(
            @RequestParam("deckId") String deckId,
            @RequestHeader("X-User-Id") String userId) {
        sessionService.deleteSession(userId, deckId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cache")
    public ResponseEntity<Void> clearCache(
            @RequestParam("deckId") String deckId,
            @RequestHeader("X-User-Id") String userId) {
        sessionService.clearCache(userId, deckId);
        return ResponseEntity.noContent().build();
    }
}
