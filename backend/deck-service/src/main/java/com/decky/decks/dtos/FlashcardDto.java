package com.decky.decks.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public class FlashcardDto {

    // ── Requests ────────────────────────────────────────────────────────────────

    public record CreateRequest(
            @NotBlank(message = "El ID del mazo es obligatorio")
            String deckId,

            @NotBlank(message = "El texto frontal es obligatorio")
            String frontText,

            @NotBlank(message = "El texto posterior es obligatorio")
            String backText,

            List<String> tags,
            Map<String, String> extraInfo
    ) {}

    public record UpdateRequest(
            @NotBlank(message = "El texto frontal es obligatorio")
            String frontText,

            @NotBlank(message = "El texto posterior es obligatorio")
            String backText,

            List<String> tags,
            Map<String, String> extraInfo
    ) {}

    public record ReviewBatchRequest(
            @NotBlank(message = "El ID del mazo es obligatorio")
            String deck,

            @NotNull(message = "El tamaño es obligatorio")
            @Min(value = 1, message = "El tamaño del lote debe ser de al menos 1 tarjeta")
            Integer size
    ) {}

    // ── Responses ───────────────────────────────────────────────────────────────

    public record DeckSizeResponse(
            String deckId,
            long size
    ) {}
}
