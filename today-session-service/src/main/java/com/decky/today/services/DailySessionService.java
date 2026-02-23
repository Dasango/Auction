package com.decky.today.services;

import com.decky.today.models.DailySession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailySessionService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "DailySession:";
    private static final Duration TTL = Duration.ofDays(1);

    public DailySession saveSession(DailySession session) {
        String key = KEY_PREFIX + session.getUserId();
        redisTemplate.opsForValue().set(key, session, TTL);
        return session;
    }

    public Optional<DailySession> getSession(String userId) {
        String key = KEY_PREFIX + userId;
        Object result = redisTemplate.opsForValue().get(key);
        return Optional.ofNullable((DailySession) result);
    }

    public void deleteSession(String userId) {
        redisTemplate.delete(KEY_PREFIX + userId);
    }

    public Optional<DailySession> updateSession(String userId){
        String key = KEY_PREFIX + userId;
        Object result = redisTemplate.opsForValue().get(key);
        return Optional.ofNullable((DailySession) result);
    }
}