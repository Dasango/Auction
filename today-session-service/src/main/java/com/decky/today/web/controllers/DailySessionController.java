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
    public ResponseEntity<DailySession> createSession(@RequestBody DailySession session) {
        DailySession savedSession = sessionService.saveSession(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSession);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<DailySession> getSession(@PathVariable String userId) {
        return sessionService.getSession(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{user_id}")
    public ResponseEntity<DailySession> updateSession(@PathVariable String userId){
        return sessionService.updateSession(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}