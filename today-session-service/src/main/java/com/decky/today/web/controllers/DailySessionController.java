package com.decky.today.web.controllers;

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
    public ResponseEntity<DailySession> createSession(@RequestBody DailySession session, Principal principal) {
        session.setUserId(principal.getName());
        DailySession savedSession = sessionService.saveSession(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSession);
    }

    @GetMapping
    public ResponseEntity<DailySession> getSession(Principal principal) {
        return sessionService.getSession(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<DailySession> updateSession(Principal principal) {
        return sessionService.updateSession(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}