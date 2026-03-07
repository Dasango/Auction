import api from "./axios";

export const setupMocks = () => {
    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    
    if (!useMock) return;

    console.log("🚀 API Mocking Enabled");

    // Intercept requests and return mock responses
    api.interceptors.request.use(async (config) => {
        const url = config.url || "";
        
        // Auth Mocks
        if (url === "/auth/login") {
            await new Promise(resolve => setTimeout(resolve, 600));
            config.adapter = async () => ({
                data: "mock-jwt-token",
                status: 200, statusText: "OK", headers: {}, config
            });
        }

        if (url === "/auth/signup") {
            await new Promise(resolve => setTimeout(resolve, 600));
            config.adapter = async () => ({
                data: { message: "User created successfully" },
                status: 201, statusText: "Created", headers: {}, config
            });
        }

        // Flashcard Mocks
        if (url === "/api/flashcards") {
            config.adapter = async () => ({
                data: [
                    { id: "1", userId: "user_123", deckId: "Spanish Vocab", frontText: "Hola", backText: "Hello", tags: ["basic"], extraInfo: {}, nextReviewDate: 20000, easeFactor: 2.5, interval: 1, repetitions: 1 },
                    { id: "2", userId: "user_123", deckId: "Spanish Vocab", frontText: "Gracias", backText: "Thank you", tags: ["basic"], extraInfo: {}, nextReviewDate: 20005, easeFactor: 2.6, interval: 6, repetitions: 2 },
                    { id: "3", userId: "user_123", deckId: "React Hooks", frontText: "useState", backText: "Manages state in functional components", tags: ["react"], extraInfo: {}, nextReviewDate: null, easeFactor: 2.5, interval: 0, repetitions: 0 },
                ],
                status: 200, statusText: "OK", headers: {}, config
            });
        }

        if (url === "/api/flashcards/decks") {
            config.adapter = async () => ({
                data: ["Spanish Vocab", "React Hooks", "History"],
                status: 200, statusText: "OK", headers: {}, config
            });
        }

        if (url.startsWith("/api/flashcards/deck/") && url.endsWith("/size")) {
            const deckId = decodeURIComponent(url.split("/")[4]);
            config.adapter = async () => ({
                data: { deckId, size: deckId === "Spanish Vocab" ? 42 : 15 },
                status: 200, statusText: "OK", headers: {}, config
            });
        }

        if (url.startsWith("/api/flashcards/deck/") && !url.endsWith("/size")) {
            const deckId = decodeURIComponent(url.split("/")[4]);
            config.adapter = async () => ({
                data: [
                    { id: "1", frontText: "Hola", backText: "Hello", deckId, tags: ["basic"], extraInfo: {} },
                    { id: "2", frontText: "Gracias", backText: "Thank you", deckId, tags: ["basic"], extraInfo: {} },
                ],
                status: 200, statusText: "OK", headers: {}, config
            });
        }

        if (url.startsWith("/api/flashcards/") && config.method === "put") {
            config.adapter = async () => ({
                data: { ...JSON.parse(config.data), id: url.split("/")[3] },
                status: 200, statusText: "OK", headers: {}, config
            });
        }

        // Session Mocks
        if (url.startsWith("/api/sessions")) {
            const params = new URLSearchParams(config.params);
            const deckId = params.get("deckId") || "default";
            
            if (config.method === "get") {
                config.adapter = async () => ({
                    data: {
                        userId: "user_123",
                        flashcardsToReview: [
                            { id: "1", deckId, frontText: "Hola", backText: "Hello", nextReviewDate: 100, easeFactor: 2.5, interval: 1, repetitions: 1 },
                            { id: "2", deckId, frontText: "Adiós", backText: "Goodbye", nextReviewDate: 105, easeFactor: 2.5, interval: 1, repetitions: 1 }
                        ],
                        cardsReviewedToday: 5
                    },
                    status: 200, statusText: "OK", headers: {}, config
                });
            }
        }

        if (url.match(/\/api\/sessions\/.*\/review/)) {
            config.adapter = async () => ({
                data: {},
                status: 200, statusText: "OK", headers: {}, config
            });
        }

        return config;
    });
};
