package com.decky.today.services;


import com.decky.today.persistence.models.DailySession;
import com.decky.today.persistence.repositories.DailySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailySessionService {

    private final DailySessionRepository sessionRepository;

    public DailySession saveSession(DailySession session) {
        return sessionRepository.save(session);
    }

    public Optional<DailySession> getSession(String userId) {
        return sessionRepository.findById(userId);
    }
}