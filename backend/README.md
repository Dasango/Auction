# Decky - Flashcards (Microservices)

---
# User Auth Service

Handles authentication and account management for the platform. All endpoints live under `/auth`.
## `POST /auth/signup`

Creates a new user account. `username` and `password` are both required. Username must be between 4 and 20 characters, password between 8 and 64.

**Request Body**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response** `201 Created`
```
Usuario registrado con éxito
```


## `POST /auth/login`

Authenticates an existing user. Returns a **JWT token** on success, which is required to access other services in the architecture. Pass it as a `Bearer` token in the `Authorization` header on subsequent requests.

**Request Body**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response** `200 OK`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoxNzA...
```


## Using the token

Include the JWT returned by `/login` in every request to protected services:

```
Authorization: Bearer <token>
```
---
# Flashcard Service

Handles flashcard creation, editing, deletion, deck management, and spaced repetition reviews. All endpoints live under `/api/flashcards`.

Every request requires an `X-User-Id` header to identify the caller. The service uses it to scope all data and enforce ownership.

## Global

### `GET /api/flashcards`
Returns all flashcards belonging to the user across every deck.

**Headers**
```
X-User-Id: user_123
```

**Response**
```json
[
  {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "userId": "user_123",
    "deckId": "spanish-vocab",
    "frontText": "Bonjour",
    "backText": "Hello",
    "tags": ["greetings"],
    "extraInfo": { "example": "Bonjour, comment ça va?" },
    "nextReviewDate": null,
    "easeFactor": 2.5,
    "interval": 0,
    "repetitions": 0
  }
]
```


### `POST /api/flashcards`
Creates a new flashcard. `deckId`, `frontText`, and `backText` are required. `tags` and `extraInfo` are optional.

**Headers**
```
X-User-Id: user_123
```

**Request Body**
```json
{
  "deckId": "spanish-vocab",
  "frontText": "Bonjour",
  "backText": "Hello",
  "tags": ["greetings"],
  "extraInfo": { "example": "Bonjour, comment ça va?" }
}
```

**Response** `201 Created`
```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "userId": "user_123",
  "deckId": "spanish-vocab",
  "frontText": "Bonjour",
  "backText": "Hello",
  "tags": ["greetings"],
  "extraInfo": { "example": "Bonjour, comment ça va?" },
  "nextReviewDate": null,
  "easeFactor": 2.5,
  "interval": 0,
  "repetitions": 0
}
```


### `PUT /api/flashcards/{id}`
Updates the content of an existing flashcard. All four fields are accepted — `frontText` and `backText` are required, `tags` and `extraInfo` are optional. Only the owner can edit it.

**Headers**
```
X-User-Id: user_123
```

**Request Body**
```json
{
  "frontText": "Bonjour",
  "backText": "Hello (formal)",
  "tags": ["greetings", "formal"],
  "extraInfo": {}
}
```

**Response** `200 OK`
```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "userId": "user_123",
  "deckId": "spanish-vocab",
  "frontText": "Bonjour",
  "backText": "Hello (formal)",
  "tags": ["greetings", "formal"],
  "extraInfo": {},
  "nextReviewDate": 20000,
  "easeFactor": 2.5,
  "interval": 0,
  "repetitions": 0
}
```

### `DELETE /api/flashcards/{deckId}/{id}`
Deletes a flashcard. Requires `deckId` in the path so the cached deck size is invalidated immediately. Only the owner can delete it.

**Headers**
```
X-User-Id: user_123
```

**Response** `204 No Content`

## Deck-scoped

### `GET /api/flashcards/decks`
Returns all distinct deck IDs that the user has flashcards in.

**Headers**
```
X-User-Id: user_123
```

**Response** `200 OK`
```json
["spanish-vocab", "math-formulas", "history"]
```

### `GET /api/flashcards/deck/{deckId}`
Returns all flashcards inside a specific deck belonging to the user.

**Headers**
```
X-User-Id: user_123
```

**Response** `200 OK`
```json
[
  {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "userId": "user_123",
    "deckId": "spanish-vocab",
    "frontText": "Bonjour",
    "backText": "Hello",
    "tags": ["greetings"],
    "extraInfo": {},
    "nextReviewDate": 20005,
    "easeFactor": 2.6,
    "interval": 6,
    "repetitions": 2
  }
]
```

### `GET /api/flashcards/deck/{deckId}/size`
Returns the total card count for a deck. The value is **cached** and updates automatically when cards are created or deleted.

**Headers**
```
X-User-Id: user_123
```

**Response** `200 OK`
```json
{
  "deckId": "spanish-vocab",
  "size": 42
}
```


## Review

### `POST /api/flashcards/review`
Returns a batch of cards due for review in a given deck. The batch is a mix of cards past their `nextReviewDate` and brand-new cards where `nextReviewDate` is null. `deck` and `size` are both required.

**Headers**
```
X-User-Id: user_123
```

**Request Body**
```json
{
  "deck": "spanish-vocab",
  "size": 10
}
```

**Response** `200 OK`
```json
[
  {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "userId": "user_123",
    "deckId": "spanish-vocab",
    "frontText": "Bonjour",
    "backText": "Hello",
    "tags": ["greetings"],
    "extraInfo": {},
    "nextReviewDate": 19998,
    "easeFactor": 2.5,
    "interval": 1,
    "repetitions": 1
  }
]
```

### `POST /api/flashcards/{id}/review`
Submits a review result for a single card using the **SM-2** spaced repetition algorithm. Updates `nextReviewDate`, `interval`, `easeFactor`, and `repetitions` on the card.

`quality` is passed as a **query parameter** and must be an integer between `0` and `5`.

| Value | Meaning                      |
|-------|------------------------------|
| 0 – 2 | Incorrect — card is reset    |
| 3     | Correct but hard             |
| 4     | Correct with some hesitation |
| 5     | Perfect recall               |

**Headers**
```
X-User-Id: user_123
```

**Query Params**
```
quality=4
```

**Response** `200 OK`
```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "userId": "user_123",
  "deckId": "spanish-vocab",
  "frontText": "Bonjour",
  "backText": "Hello",
  "tags": ["greetings"],
  "extraInfo": {},
  "nextReviewDate": 20007,
  "easeFactor": 2.6,
  "interval": 6,
  "repetitions": 2
}
```
---

# Daily Session Service

Manages daily review sessions for a user. It acts as a cache layer on top of the Flashcard Service — on the first request of the day it fetches a review batch from the deck service and stores it in Redis, subsequent requests within the same day hit the cache directly. Sessions expire after 24 hours.

All endpoints live under `/api/sessions`.

## `POST /api/sessions`

Creates or overwrites a session for the user. Useful for manually seeding a session with a specific state.

**Headers**
```
X-User-Id: user_123
```

**Request Body**
```json
{
  "flashcardsToReview": [
    {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "deckId": "spanish-vocab",
      "frontText": "Bonjour",
      "backText": "Hello",
      "tags": ["greetings"],
      "extraInfo": { "example": "Bonjour, comment ça va?" }
    }
  ],
  "cardsReviewedToday": 0
}
```

**Response** `201 Created`
```json
{
  "userId": "user_123",
  "flashcardsToReview": [
    {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "deckId": "spanish-vocab",
      "frontText": "Bonjour",
      "backText": "Hello",
      "tags": ["greetings"],
      "extraInfo": { "example": "Bonjour, comment ça va?" }
    }
  ],
  "cardsReviewedToday": 0
}
```

## `GET /api/sessions`

Returns the active session for the user. If no session exists in Redis, it automatically fetches a fresh review batch from the Flashcard Service, saves it, and returns it. Returns `404` if the batch could not be fetched.

**Headers**
```
X-User-Id: user_123
```

**Query Params**

| Param       | Required | Default | Description                                         |
|-------------|----------|---------|-----------------------------------------------------|
| `deckId`    | Yes      | —       | The deck to pull the review batch from              |
| `batchSize` | No       | `20`    | Max number of new cards to include in the session   |

**Example**
```
GET /api/sessions?deckId=spanish-vocab&batchSize=10
```

**Response** `200 OK`
```json
{
  "userId": "user_123",
  "flashcardsToReview": [
    {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "deckId": "spanish-vocab",
      "frontText": "Bonjour",
      "backText": "Hello",
      "tags": ["greetings"],
      "extraInfo": {}
    },
    {
      "id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "deckId": "spanish-vocab",
      "frontText": "Merci",
      "backText": "Thank you",
      "tags": ["greetings"],
      "extraInfo": {}
    }
  ],
  "cardsReviewedToday": 3
}
```

## `POST /api/sessions/{cardId}/review`

Submits a review result for a single card. It does two things: removes the card from the active session in Redis and forwards the review to the Flashcard Service to update the card's SM-2 values. `cardsReviewedToday` is incremented by one.

`quality` must be an integer between `0` and `5`.

| Value | Meaning                      |
|-------|------------------------------|
| 0 – 2 | Incorrect — card is reset    |
| 3     | Correct but hard             |
| 4     | Correct with some hesitation |
| 5     | Perfect recall               |

**Headers**
```
X-User-Id: user_123
```

**Query Params**
```
quality=4
```

**Response** `200 OK` *(empty body)*

---
# API Gateway
Serves as the primary entry point for all program services, providing a unified interface for client access. The API Gateway operates on port 8083 and implements JWT-based authentication to control access to protected microservices while allowing unrestricted access to authentication controllers.

<div align="center">
  <sub>Built with <3 by David</sub>
</div>
---