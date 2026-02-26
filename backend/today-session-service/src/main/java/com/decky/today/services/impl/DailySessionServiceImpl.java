package com.decky.today.services.impl;

import com.decky.today.models.DailySession;
import com.decky.today.clients.DeckServiceClient;
import com.decky.today.dtos.FlashcardCacheDto;
import com.decky.today.services.DailySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailySessionServiceImpl implements DailySessionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final DeckServiceClient deckServiceClient;

    private static final String KEY_PREFIX = "DailySession:";
    private static final Duration TTL = Duration.ofDays(1);

    public DailySession saveSession(DailySession session) {
        String key = KEY_PREFIX + session.getUserId();
        redisTemplate.opsForValue().set(key, session, TTL);
        return session;
    }

    public Optional<DailySession> getSession(String userId, String deckId, int batchSize) {
        String key = KEY_PREFIX + userId;
        Object result = redisTemplate.opsForValue().get(key);

        if (result != null) {
            return Optional.of((DailySession) result);
        }

        // If not in redis, fetch from deck-service via OpenFeign
        try {
            List<Map<String, Object>> cards = deckServiceClient
                    .getReviewBatch(Map.of("deck", deckId, "size", batchSize), userId);

            List<FlashcardCacheDto> cachedCards = cards.stream().map(map -> {
                FlashcardCacheDto dto = new FlashcardCacheDto();
                dto.setId((String) map.get("id"));
                dto.setDeckId((String) map.get("deckId"));
                dto.setFrontText((String) map.get("frontText"));
                dto.setBackText((String) map.get("backText"));
                dto.setTags((List<String>) map.get("tags"));
                dto.setExtraInfo((Map<String, String>) map.get("extraInfo"));
                return dto;
            }).collect(Collectors.toList());

            DailySession newSession = DailySession.builder()
                    .userId(userId)
                    .flashcardsToReview(cachedCards)
                    .cardsReviewedToday(0)
                    .build();

            return Optional.of(saveSession(newSession));
        } catch (Exception e) {
            System.err.println("Error fetching batch from deck-service: " + e.getMessage());
            return Optional.empty();
        }
    }

    public void processReview(String userId, String cardId, int quality) {
        String key = KEY_PREFIX + userId;
        Object result = redisTemplate.opsForValue().get(key);

        if (result != null) {
            DailySession session = (DailySession) result;

            // Remove card from cache
            session.getFlashcardsToReview().removeIf(c -> c.getId() != null && c.getId().equals(cardId));
            session.setCardsReviewedToday(session.getCardsReviewedToday() + 1);

            saveSession(session);

            // Sync via Feign client seamlessly
            deckServiceClient.processReview(cardId, quality, userId);
        }
    }
}
