package com.decky.decks.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "flashcards")
@CompoundIndex(name = "user_deck_idx", def = "{'userId': 1, 'deckId': 1}")
public class Flashcard {

    @Id
    private String id;

    private String userId;

    private String deckId;

    @NotBlank(message = "El texto frontal es obligatorio")
    private String frontText;

    @NotBlank(message = "El texto posterior es obligatorio")
    private String backText;

    private List<String> tags;

    private Map<String, String> extraInfo;

    private Integer nextReviewDate;

    @Builder.Default
    private Double easeFactor = 2.5;

    @Builder.Default
    private Integer interval = 0;

    @Builder.Default
    private Integer repetitions = 0;

}
