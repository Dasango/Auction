package com.decky.today.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailySession implements Serializable {

    @Id
    private String userId;
    
    private List<FlashcardCacheDto> flashcardsToReview;
    
    private int cardsReviewedToday;
}