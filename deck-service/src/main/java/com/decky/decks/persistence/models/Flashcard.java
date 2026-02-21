package com.decky.decks.persistence.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "flashcards")
public class Flashcard {

    @Id
    private String id;

    private String userId;
    @Indexed
    private String deckId;
    
    private String frontText;
    private String backText;

    private List<String> tags;

    private Map<String, String> extraInfo;

    private LocalDateTime nextReviewDate;

}