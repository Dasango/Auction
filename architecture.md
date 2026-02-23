# Decky Architecture

## 1. Deck Service (`deck-service`)

**Goal:** Manages the core spaced-repetition data, specifically the flashcards themselves.
**Boundary:**

- Responsible for CRUD operations on Flashcards.
- Tracks spaced-repetition metadata per flashcard, such as `nextReviewDate`, interval, ease factor, etc.
- Employs a persistent relational database for long-term storage of all flashcards.
- Does not handle user authentication, expecting a valid user ID to be provided in requests.

## 2. Today Session Service (`today-session-service`)

**Goal:** Manages the active, daily study sessions for users to optimize performance and reduce database load during intensive review sessions.
**Boundary:**

- Responsible for fetching, caching, and serving the flashcards due for the current day.
- Utilizes Redis for fast, in-memory access during study sessions.
- Acts as a temporary workspace; it does not permanently store flashcards but rather orchestrates the daily review queue.
- Submits review results back to the Deck Service to update the spaced-repetition progression.

## 3. User Auth Service (`user-auth`)

**Goal:** Centralizes user identity and access management.
**Boundary:**

- Handles user registration, login, and secure credentials storage.
- Issues JSON Web Tokens (JWT) upon successful authentication.
- Primarily concerned with the `AppUser` and `Role` entities.
- Does not process or store any flashcard or study session data.
