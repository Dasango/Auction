package com.decky.today.services;

import com.decky.today.models.DailySession;

import java.util.Optional;

public interface DailySessionService {

    DailySession saveSession(DailySession session);

    Optional<DailySession> getSession(String userId, String deckId, int batchSize);

    void processReview(String userId, String deckId, String cardId, int quality);

    void deleteSession(String userId, String deckId);

    void clearCache(String userId, String deckId);
}
