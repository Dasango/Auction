package com.decky.today.controllers;

import com.decky.today.models.DailySession;
import com.decky.today.services.DailySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class DailySessionController {

    private final DailySessionService sessionService;

    @PostMapping
    public ResponseEntity<DailySession> createSession(@RequestBody DailySession session,
            Principal principal) {
        session.setUserId(principal.getName());
        DailySession savedSession = sessionService.saveSession(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSession);
    }

    @GetMapping
    public ResponseEntity<DailySession> getSession(
            @RequestParam("deckId") String deckId,
            @RequestParam(value = "batchSize", defaultValue = "20") int batchSize,
            Principal principal) {
        return sessionService.getSession(principal.getName(), deckId, batchSize)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{cardId}/review")
    public ResponseEntity<Void> processReview(
            @PathVariable("cardId") String cardId,
            @RequestParam("quality") int quality,
            @RequestParam(value = "deckId", required = false) String deckId,
            Principal principal) {
        sessionService.processReview(principal.getName(), deckId, cardId, quality);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteSession(
            @RequestParam("deckId") String deckId,
            Principal principal) {
        sessionService.deleteSession(principal.getName(), deckId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cache")
    public ResponseEntity<Void> clearCache(
            @RequestParam("deckId") String deckId,
            Principal principal) {
        sessionService.clearCache(principal.getName(), deckId);
        return ResponseEntity.noContent().build();
    }
}
