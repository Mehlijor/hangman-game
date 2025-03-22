const wordDisplay = document.getElementById("word-display");
const hintText = document.getElementById("hint-text");
const letterButtons = document.getElementById("letter-buttons");
const resultMessage = document.getElementById("result-message");
const hangmanImg = document.getElementById("hangman-img");
const playAgainBtn = document.getElementById("play-again");

let word = "";
let hint = "";
let guessedLetters = [];
let incorrectGuesses = 0;
const maxGuesses = 6;

const game = {
  fetchWord: async function () {
    const res = await fetch("words.json");
    const words = await res.json();
    const random = words[Math.floor(Math.random() * words.length)];
    word = random.word.toLowerCase();
    hint = random.hint;
    hintText.textContent = hint;
    guessedLetters = [];
    incorrectGuesses = 0;
    hangmanImg.src = `images/hangman-0.svg`;
    resultMessage.innerHTML = "";
    playAgainBtn.style.display = "none";
    this.displayWord();
    this.createLetterButtons();
  },

  displayWord: function () {
    wordDisplay.textContent = word
      .split("")
      .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  },

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

  endGame: function (won) {
    resultMessage.innerHTML = won
      ? `<p>🎉 You Won!</p><img src="images/win.gif" alt="Win animation" />`
      : `<p>💀 You Lost! The word was "<strong>${word}</strong>".</p><img src="images/lose.gif" alt="Lose animation" />`;
    document.querySelectorAll("#letter-buttons button").forEach(btn => (btn.disabled = true));
    playAgainBtn.style.display = "inline-block";
  }
};

playAgainBtn.addEventListener("click", () => game.fetchWord());

// Start the game
game.fetchWord();
