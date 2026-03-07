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
        String key = KEY_PREFIX + session.getUserId() + ":" + session.getDeckId();
        redisTemplate.opsForValue().set(key, session, TTL);
        return session;
    }

    public Optional<DailySession> getSession(String userId, String deckId, int batchSize) {
        String key = KEY_PREFIX + userId + ":" + deckId;
        Object result = redisTemplate.opsForValue().get(key);

        if (result != null) {
            return Optional.of((DailySession) result);
        }

        // If not in redis, fetch from deck-service via OpenFeign
        try {
            List<Map<String, Object>> cards = deckServiceClient
                    .getReviewBatch(Map.of("deck", deckId, "size", batchSize), userId);

            @SuppressWarnings("unchecked")
            List<FlashcardCacheDto> cachedCards = cards.stream().map(map -> {
                FlashcardCacheDto dto = new FlashcardCacheDto();
                dto.setId((String) map.get("id"));
                dto.setDeckId((String) map.get("deckId"));
                dto.setFrontText((String) map.get("frontText"));
                dto.setBackText((String) map.get("backText"));
                dto.setTags((List<String>) map.get("tags"));
                dto.setExtraInfo((Map<String, String>) map.get("extraInfo"));
                dto.setNextReviewDate((Integer) map.get("nextReviewDate"));
                dto.setEaseFactor((Double) map.get("easeFactor"));
                dto.setInterval((Integer) map.get("interval"));
                dto.setRepetitions((Integer) map.get("repetitions"));
                return dto;
            }).collect(Collectors.toList());

            DailySession newSession = DailySession.builder()
                    .userId(userId)
                    .deckId(deckId)
                    .flashcardsToReview(cachedCards)
                    .cardsReviewedToday(0)
                    .build();

            return Optional.of(saveSession(newSession));
        } catch (Exception e) {
            System.err.println("Error fetching batch from deck-service: " + e.getMessage());
            return Optional.empty();
        }
    }

    public void processReview(String userId, String deckId, String cardId, int quality) {
        String key = KEY_PREFIX + userId + ":" + (deckId != null ? deckId : "*");

        if (deckId != null) {
            DailySession session = (DailySession) redisTemplate.opsForValue().get(key);
            if (session != null) {
                if (quality >= 3) {
                    session.getFlashcardsToReview().removeIf(c -> c.getId().equals(cardId));
                    session.setCardsReviewedToday(session.getCardsReviewedToday() + 1);
                    // Sync via Feign client only if passed
                    deckServiceClient.processReview(cardId, quality, userId);
                } else {
                    // If failed, move to the end of the list for re-review
                    Optional<FlashcardCacheDto> cardOpt = session.getFlashcardsToReview().stream()
                            .filter(c -> c.getId().equals(cardId)).findFirst();
                    if (cardOpt.isPresent()) {
                        FlashcardCacheDto card = cardOpt.get();
                        session.getFlashcardsToReview().remove(card);
                        session.getFlashcardsToReview().add(card);
                    }
                }
                saveSession(session);
            }
        } else {
            // Fallback to scanning if deckId is missing
            redisTemplate.keys(key).forEach(k -> {
                DailySession session = (DailySession) redisTemplate.opsForValue().get(k);
                if (session != null) {
                    Optional<FlashcardCacheDto> cardOpt = session.getFlashcardsToReview().stream()
                            .filter(c -> c.getId().equals(cardId)).findFirst();
                    if (cardOpt.isPresent()) {
                        if (quality >= 3) {
                            session.getFlashcardsToReview().removeIf(c -> c.getId().equals(cardId));
                            session.setCardsReviewedToday(session.getCardsReviewedToday() + 1);
                            deckServiceClient.processReview(cardId, quality, userId);
                        } else {
                            FlashcardCacheDto card = cardOpt.get();
                            session.getFlashcardsToReview().remove(card);
                            session.getFlashcardsToReview().add(card);
                        }
                        redisTemplate.opsForValue().set(k, session, TTL);
                    }
                }
            });
        }
    }

    public void deleteSession(String userId, String deckId) {
        String key = KEY_PREFIX + userId + ":" + deckId;
        redisTemplate.delete(key);
    }

    @Override
    public void clearCache(String userId, String deckId) {
        deleteSession(userId, deckId);
    }
}
