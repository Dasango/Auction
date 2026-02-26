package com.decky.today.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "deck-service", url = "${deck.service.url:http://localhost:8080}")
public interface DeckServiceClient {

        @PostMapping("/api/flashcards/review")
        List<Map<String, Object>> getReviewBatch(
                        @RequestBody Map<String, Object> request,
                        @RequestHeader("X-User-Id") String userId);

        @PostMapping("/api/flashcards/{id}/review")
        Map<String, Object> processReview(
                        @PathVariable("id") String id,
                        @RequestParam("quality") int quality,
                        @RequestHeader("X-User-Id") String userId);
}
