package com.decky.today.persistence.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "DailySession", timeToLive = 86400) 
public class DailySession implements Serializable {

    @Id
    private String userId;
    
    private List<FlashcardCacheDto> flashcardsToReview;
    
    private int cardsReviewedToday;
}