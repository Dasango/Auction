package com.decky.today.web.controllers;

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
    public ResponseEntity<DailySession> getSession(@RequestHeader("X-User-Id") String userId) {
        return sessionService.getSession(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<DailySession> updateSession(@RequestHeader("X-User-Id") String userId) {
        return sessionService.updateSession(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}