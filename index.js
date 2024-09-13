const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let moveCount = 0;
let matchedPairs = 0;
const totalPairs = cards.length / 2; // Calculate total pairs
let timerInterval;
let seconds = 0;

// Select elements for timer and moves
const timerDisplay = document.getElementById('time');
const moveCountDisplay = document.getElementById('moveCount');
const feedbackDisplay = document.getElementById('feedback');

// Start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    // Format time as mm:ss
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Flip a card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // First card clicked
    hasFlippedCard = true;
    firstCard = this;
  } else {
    // Second card clicked
    secondCard = this;
    checkForMatch();
  }

  // Start timer on the first move
  if (moveCount === 0) {
    startTimer();
  }
  moveCount++;
  moveCountDisplay.textContent = moveCount; // Update move count display
}

// Check if two cards match
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  matchedPairs++;
  if (matchedPairs === totalPairs) {
    stopTimer(); // Stop the timer when all pairs are matched
    calculateScore();
  }
  resetBoard();
}

// Unflip non-matching cards
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

// Reset the board state
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Shuffle the cards
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
})();

// Add event listener to each card
cards.forEach(card => card.addEventListener('click', flipCard));

// Calculate the final score and provide feedback
function calculateScore() {
  let baseScore = 1000;
  let timePenalty = seconds * 2; // Time penalty (2 points per second)
  let movePenalty = moveCount * 10; // Move penalty (10 points per move)

  let finalScore = baseScore - timePenalty - movePenalty;

  if (finalScore < 0) {
    finalScore = 0; // Ensure score doesn't go below zero
  }

  let feedbackMessage = `Score: ${finalScore}. `;

  // Provide performance feedback based on the number of moves
  if (moveCount <= 20) {
    feedbackMessage += "Great job! You completed the game with excellent efficiency!";
  } else if (moveCount <= 30) {
    feedbackMessage += "Good job! You can still improve your efficiency.";
  } else {
    feedbackMessage += "You took a lot of moves. Try to improve next time!";
  }

  feedbackDisplay.textContent = feedbackMessage;
}
