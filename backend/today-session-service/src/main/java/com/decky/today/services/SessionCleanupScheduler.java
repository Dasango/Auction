package com.decky.today.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionCleanupScheduler {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String KEY_PATTERN = "DailySession:*";

    @Scheduled(cron = "0 0 0 * * *") // Midnight every day
    public void cleanupSessions() {
        log.info("Starting daily session cleanup...");
        Set<String> keys = redisTemplate.keys(KEY_PATTERN);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("Deleted {} daily sessions.", keys.size());
        }
    }
}
