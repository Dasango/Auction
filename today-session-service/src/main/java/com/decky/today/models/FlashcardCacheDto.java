package com.decky.today.models;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class FlashcardCacheDto implements Serializable {
    private String deckId;
    private String frontText;
    private String backText;

    private List<String> tags;

    private Map<String, String> extraInfo;

}