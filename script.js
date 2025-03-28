// Grabs all the main elements from the page that we need to interact with
// These let us show the word, hint, result message, hangman image, and all the buttons
const wordDisplay = document.getElementById("word-display");
const hintText = document.getElementById("hint-text");
const letterButtons = document.getElementById("letter-buttons");
const resultMessage = document.getElementById("result-message");
const hangmanImg = document.getElementById("hangman-img");
const playAgainBtn = document.getElementById("play-again");
const guessTracker = document.getElementById("guess-tracker");

// Tracks the actual word, the hint for it, what letters were guessed, and how many guesses were wrong
// maxGuesses just sets the limit to how many times the user can mess up before game ends
let word = "";
let hint = "";
let guessedLetters = [];
let incorrectGuesses = 0;
const maxGuesses = 6;

// Main game object that stores everything needed for the game to run
// Holds functions for loading the word, checking guesses, building the UI, etc.
const game = {
  // Pulls a random word and hint from the JSON file
  // Resets everything for a new game and builds the buttons again
  fetchWord: async function () {
    const res = await fetch("words.json");
    const words = await res.json();
    const random = words[Math.floor(Math.random() * words.length)];

    // stores the word and hint from the random object we picked
    word = random.word.toLowerCase();
    hint = random.hint;

    // pushes the hint to the screen
    hintText.textContent = hint;

    // resets game data so it’s like a fresh start
    guessedLetters = [];
    incorrectGuesses = 0;
    hangmanImg.src = `images/hangman-0.svg`;
    resultMessage.innerHTML = "";
    resultMessage.style.display = "none";
    playAgainBtn.style.display = "none";

    // updates word area with blanks and creates the A–Z buttons
    this.displayWord();
    this.createLetterButtons();
    this.updateGuessTracker();
  },

  // Builds the wrench tracker UI below the game
  // Shows a row of wrench icons based on how many guesses you have left
  // If guess is wrong, one wrench becomes “used” by adding the .used class
  updateGuessTracker: function () {
    guessTracker.innerHTML = "";
    for (let i = 0; i < maxGuesses; i++) {
      const icon = document.createElement("span");
      icon.className = "wrench" + (i < maxGuesses - incorrectGuesses ? "" : " used");
      icon.textContent = "🔧";
      guessTracker.appendChild(icon);
    }
  },

  // Goes through the word letter by letter and shows "_" if it hasn't been guessed yet
  // Shows actual letter if it's been guessed already
  displayWord: function () {
    wordDisplay.textContent = word
      .split("")
      .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  },

  // Creates 26 buttons from A to Z using ASCII codes (65–90)
  // Adds each button to the page and sets up click event to guess the letter
  createLetterButtons: function () {
    letterButtons.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i);
      const button = document.createElement("button");
      button.textContent = char;
      button.addEventListener("click", () => this.guessLetter(char.toLowerCase(), button));
      letterButtons.appendChild(button);
    }
  },

  // Runs whenever a user clicks a letter
  // Disables that letter so you can't click it again
  // If the letter is in the word it gets revealed, otherwise we increase wrong guess count
  guessLetter: function (letter, button) {
    button.disabled = true;
    if (word.includes(letter)) {
      guessedLetters.push(letter);
      this.displayWord();
      if (!wordDisplay.textContent.includes("_")) {
        this.endGame(true);
      }
    } else {
      incorrectGuesses++;
      this.updateGuessTracker();
      hangmanImg.style.opacity = 0;
      setTimeout(() => {
        hangmanImg.src = `images/hangman-${incorrectGuesses}.svg`;
        hangmanImg.style.opacity = 1;
      }, 250);
      if (incorrectGuesses >= maxGuesses) {
        this.endGame(false);
      }
    }
  },

  // Runs when game ends either by win or loss
  // Shows message, gif, disables all letter buttons, and shows Play Again
  endGame: function (won) {
    resultMessage.innerHTML = won
      ? `
        <p>🎉 You Won!</p>
        <img src="images/win.gif" alt="Win animation" />
        <button id="play-again">Play Again</button>
      `
      : `
        <p>💀 You Lost! The word was "<strong>${word}</strong>".</p>
        <img src="images/lose.gif" alt="Lose animation" />
        <button id="play-again">Play Again</button>
      `;

    resultMessage.style.display = "block";

    document.getElementById("play-again").addEventListener("click", () => game.fetchWord());

    document.querySelectorAll("#letter-buttons button").forEach(btn => (btn.disabled = true));
  }

};

// When the Play Again button is clicked, it resets the game by calling fetchWord again
playAgainBtn.addEventListener("click", () => game.fetchWord());

// Automatically runs fetchWord when page loads so game starts right away
game.fetchWord();
