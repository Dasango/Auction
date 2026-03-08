/**
 * Centralized JSON extraction and validation logic.
 * Ensures JSON is valid and conforms to expected structure.
 */

export interface FlashcardImport {
  frontText: string;
  backText: string;
  tags: string[];
  extraInfo: any;
}

export interface BatchImport {
  flashcards: FlashcardImport[];
}

export const validateFlashcardBatch = (json: any): FlashcardImport[] => {
  if (!json) throw new Error("JSON is empty");

  let cards: any[] = [];

  // Support both direct array or { flashcards: [...] } wrapper
  if (Array.isArray(json)) {
    cards = json;
  } else if (json.flashcards && Array.isArray(json.flashcards)) {
    cards = json.flashcards;
  } else {
    throw new Error("Invalid format: JSON must be an array or contain a 'flashcards' array");
  }

  return cards.map((card, index) => {
    if (!card.frontText || typeof card.frontText !== 'string') {
      throw new Error(`Card ${index + 1} is missing 'frontText'`);
    }
    if (!card.backText || typeof card.backText !== 'string') {
      throw new Error(`Card ${index + 1} is missing 'backText'`);
    }

    return {
      frontText: card.frontText.trim(),
      backText: card.backText.trim(),
      tags: Array.isArray(card.tags) ? card.tags.map((t: any) => String(t).trim()) : [],
      extraInfo: card.extraInfo || {}
    };
  });
};

export const parseFileAsJson = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch (err) {
        reject(new Error("Malformed JSON file: " + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
