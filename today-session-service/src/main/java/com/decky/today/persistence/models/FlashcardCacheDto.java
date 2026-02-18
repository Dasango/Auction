package com.decky.today.persistence.models;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import lombok.Data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Data
public class FlashcardCacheDto implements Serializable {
    private String id;
    private String frontText;
    private String backText;

    private Map<String, Object> otherFields = new HashMap<>();

    @JsonAnySetter
    public void catchOtherFields(String llave, Object valor) {
        this.otherFields.put(llave, valor);
    }
}