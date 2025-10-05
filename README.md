# Skor Arkadaşı: Okey Scorekeeper

[cloudflarebutton]

A playful and intuitive scorekeeping web app for a 4-player Okey-style tile game with custom round-based scoring rules.

Skor Arkadaşı is a delightful, mobile-first web application designed to simplify scorekeeping for a 4-player Okey-style tile game. Built with a playful and intuitive user interface, it eliminates manual calculations and lets players focus on the game. The application manages player names, tracks scores across 11 rounds, and automatically calculates penalties based on user-selected color coefficients for each round. The entire game state is saved to the browser's local storage, so progress is never lost on a page refresh.

## ✨ Key Features

-   **4-Player Score Tracking**: Easily manage scores for up to four players.
-   **Round-by-Round Logging**: Input scores for each of the 11 rounds of the game.
-   **Custom Color Coefficients**: Select a color (Blue, Red, Yellow, Black) each round to apply its unique penalty multiplier (5x, 4x, 3x, 6x).
-   **Automatic Calculations**: The app automatically calculates penalty points for losers and awards -100 points to the winner of each round.
-   **Final Round Bonus**: A special 10x score multiplier is automatically applied to all points in the 11th and final round.
-   **Persistent State**: Your game is automatically saved to your browser's local storage, so you can pick up right where you left off.
-   **Winner Summary**: A celebratory results screen declares the winner (player with the lowest score) at the end of the game.
-   **Playful & Responsive UI**: A beautiful, mobile-first design that is a joy to use on any device.

## 🚀 Technology Stack

-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS, shadcn/ui
-   **State Management**: Zustand (with persistence)
-   **Forms**: React Hook Form & Zod for validation
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Deployment**: Cloudflare Workers

## 🏁 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd skor_arkadasi_okey
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application will be available at `http://localhost:3000` (or the next available port).

## 🎮 How to Use

1.  **Player Setup**: On the first launch, enter the names for all four players and click "Start Game".
2.  **Log a Round**: Click the "Log Round X" button to open the scoring dialog.
3.  **Enter Scores**:
    -   Select the round's color coefficient.
    -   Choose the winner from the dropdown menu.
    -   Enter the remaining tile sums for the other three players.
4.  **Save Round**: Click "Save Round". The scoreboard will update automatically.
5.  **Complete the Game**: Repeat the process for all 11 rounds.
6.  **View Results**: After the final round, a "View Results" button will appear. Click it to see the final scores and the game's winner.

## 🛠️ Development Scripts

-   `bun run dev`: Starts the Vite development server with live reloading.
-   `bun run build`: Compiles and bundles the application for production.
-   `bun run lint`: Lints the codebase to check for errors.
-   `bun run deploy`: Deploys the application to your Cloudflare account.

## ☁️ Deployment

This project is configured for seamless deployment to **Cloudflare Workers**.

To deploy your own version, simply click the button below or run the deploy command after setting up your Cloudflare account and Wrangler.

[cloudflarebutton]

### Manual Deployment

1.  **Login to Cloudflare:**
    ```bash
    bunx wrangler login
    ```

2.  **Build the project:**
    ```bash
    bun run build
    ```

3.  **Deploy to Cloudflare:**
    ```bash
    bun run deploy
    ```
    Wrangler will build the worker and deploy it, providing you with a live URL.