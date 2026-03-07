package com.decky.decks.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "today-session-service", url = "${TODAY_SESSION_SERVICE_URI}")
public interface TodayServiceClient {

    @DeleteMapping("/api/sessions/cache")
    void clearCache(
            @RequestParam("deckId") String deckId,
            @RequestHeader("X-User-Id") String userId);
}
