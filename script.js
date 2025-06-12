// DOM Elements
const startButton = document.querySelector('#btn-start');
const hitButton = document.querySelector('#btn-hit');
const standButton = document.querySelector('#btn-stand');
const resetButton = document.querySelector('#btn-reset');
const playerScoreElement = document.querySelector('#player-score');
const dealerScoreElement = document.querySelector('#dealer-score');
const dealerCardsContainer = document.querySelector('#dealer-cards');
const playerCardsContainer = document.querySelector('#player-cards');
const resultMessage = document.getElementById('result-message');
const playerWinsElement = document.getElementById('player-wins');
const dealerWinsElement = document.getElementById('dealer-wins');

// Game State
let playerScore = 0;
let dealerScore = 0;
let playerAces = 0;
let dealerAces = 0;
let gameStarted = false;
let playerWins = 0;
let dealerWins = 0;
let gameEnded = false;

// Card deck (more realistic card values)
const cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // A, 2-10, J, Q, K
const cardNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Get random card value (1-13)
function getRandomCardValue() {
  return Math.floor(Math.random() * 13) + 1;
}

// Calculate actual card value for blackjack
function getCardGameValue(cardValue) {
  if (cardValue === 1) return 11; // Ace initially counts as 11
  if (cardValue >= 11) return 10; // J, Q, K = 10
  return cardValue; // 2-10 = face value
}

// Get card display name
function getCardDisplayName(cardValue) {
  return cardNames[cardValue - 1];
}

// Adjust score for Aces (convert 11 to 1 if needed)
function adjustForAces(score, aces) {
  while (score > 21 && aces > 0) {
    score -= 10; // Convert an Ace from 11 to 1
    aces--;
  }
  return { score, aces };
}

// Draw a card and add to container
function drawCard(container, isPlayer = true) {
  const cardValue = getRandomCardValue();
  const gameValue = getCardGameValue(cardValue);
  const displayName = getCardDisplayName(cardValue);
  
  // Create card element
  const card = document.createElement('div');
  card.className = 'card';
  card.textContent = displayName;
  
  // Add red color for hearts/diamonds (random)
  if (Math.random() < 0.5) {
    card.classList.add('red');
  }
  
  // Add card with animation
  container.appendChild(card);
  
  // Track aces
  let aces = 0;
  if (cardValue === 1) {
    aces = 1;
  }
  
  return { gameValue, aces };
}

// Update score displays
function updateScores() {
  playerScoreElement.textContent = `Score: ${playerScore}`;
  dealerScoreElement.textContent = `Score: ${dealerScore}`;
  
  // Add visual feedback for bust
  if (playerScore > 21) {
    playerScoreElement.classList.add('bust');
  } else {
    playerScoreElement.classList.remove('bust');
  }
  
  if (dealerScore > 21) {
    dealerScoreElement.classList.add('bust');
  } else {
    dealerScoreElement.classList.remove('bust');
  }
}

// Update win counters
function updateWinCounters() {
  playerWinsElement.textContent = playerWins;
  dealerWinsElement.textContent = dealerWins;
}

// Start new game
function startGame() {
  if (gameStarted && !gameEnded) {
    if (!confirm('Game is already in progress. Start a new game?')) {
      return;
    }
  }
  
  // Reset game state
  playerScore = 0;
  dealerScore = 0;
  playerAces = 0;
  dealerAces = 0;
  gameStarted = true;
  gameEnded = false;
  
  // Clear containers
  playerCardsContainer.innerHTML = '';
  dealerCardsContainer.innerHTML = '';
  
  // Reset result message
  resultMessage.textContent = 'Game started! Hit or Stand?';
  resultMessage.className = 'result';
  
  // Deal initial cards (2 for player, 1 for dealer shown)
  for (let i = 0; i < 2; i++) {
    const card = drawCard(playerCardsContainer, true);
    playerScore += card.gameValue;
    playerAces += card.aces;
  }
  
  // Adjust for aces
  const playerAdjusted = adjustForAces(playerScore, playerAces);
  playerScore = playerAdjusted.score;
  playerAces = playerAdjusted.aces;
  
  // Deal one card to dealer
  const dealerCard = drawCard(dealerCardsContainer, false);
  dealerScore += dealerCard.gameValue;
  dealerAces += dealerCard.aces;
  
  // Update displays
  updateScores();
  
  // Enable game buttons
  hitButton.disabled = false;
  standButton.disabled = false;
  
  // Check for natural blackjack
  if (playerScore === 21) {
    resultMessage.textContent = 'Blackjack! Standing automatically.';
    setTimeout(() => playerStand(), 1000);
  }
}

// Player hits (draws a card)
function playerHit() {
  if (!gameStarted || gameEnded) return;
  
  const card = drawCard(playerCardsContainer, true);
  playerScore += card.gameValue;
  playerAces += card.aces;
  
  // Adjust for aces
  const adjusted = adjustForAces(playerScore, playerAces);
  playerScore = adjusted.score;
  playerAces = adjusted.aces;
  
  updateScores();
  
  // Check for bust
  if (playerScore > 21) {
    resultMessage.textContent = 'Bust! You went over 21. Dealer wins!';
    resultMessage.className = 'result lose';
    dealerWins++;
    endGame();
  } else if (playerScore === 21) {
    resultMessage.textContent = '21! Standing automatically.';
    setTimeout(() => playerStand(), 1000);
  }
}

// Player stands (dealer's turn)
function playerStand() {
  if (!gameStarted || gameEnded) return;
  
  gameEnded = true;
  hitButton.disabled = true;
  standButton.disabled = true;
  
  // Dealer draws until 17 or higher
  while (dealerScore < 17) {
    const card = drawCard(dealerCardsContainer, false);
    dealerScore += card.gameValue;
    dealerAces += card.aces;
    
    // Adjust for aces
    const adjusted = adjustForAces(dealerScore, dealerAces);
    dealerScore = adjusted.score;
    dealerAces = adjusted.aces;
    
    updateScores();
  }
  
  // Determine winner
  determineWinner();
}

// Determine the winner
function determineWinner() {
  let result = '';
  let resultClass = 'result';
  
  if (dealerScore > 21) {
    // Dealer bust
    result = 'Dealer busts! You win!';
    resultClass = 'result win';
    playerWins++;
  } else if (playerScore > dealerScore) {
    // Player has higher score
    result = 'You win!';
    resultClass = 'result win';
    playerWins++;
  } else if (playerScore === dealerScore) {
    // Tie
    result = "It's a draw!";
    resultClass = 'result draw';
  } else {
    // Dealer wins
    result = 'Dealer wins!';
    resultClass = 'result lose';
    dealerWins++;
  }
  
  resultMessage.textContent = result;
  resultMessage.className = resultClass;
  
  updateWinCounters();
  endGame();
}

// End the current game
function endGame() {
  gameStarted = false;
  gameEnded = true;
  hitButton.disabled = true;
  standButton.disabled = true;
}

// Reset the entire game
function resetGame() {
  if (confirm('Are you sure you want to reset? This will clear all win counters.')) {
    // Reset all game state
    playerScore = 0;
    dealerScore = 0;
    playerAces = 0;
    dealerAces = 0;
    gameStarted = false;
    gameEnded = false;
    playerWins = 0;
    dealerWins = 0;
    
    // Clear containers
    playerCardsContainer.innerHTML = '';

    dealerCardsContainer.innerHTML = '';
    resultMessage.textContent = 'Game reset! Press "Start New Game" to begin.';
    resultMessage.className = 'result';
    updateScores();
    updateWinCounters();
    hitButton.disabled = true;
    standButton.disabled = true;
    resetButton.disabled = true;
  }
}
// Event listeners
startButton.addEventListener('click', startGame);
hitButton.addEventListener('click', playerHit);
standButton.addEventListener('click', playerStand);
resetButton.addEventListener('click', resetGame);
// Keyboard controls
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    startGame();
  } else if (event.code === 'KeyH') {
    playerHit();
  } else if (event.code === 'KeyS') {
    playerStand();
  } else if (event.code === 'KeyR') {
    resetGame();
  }
});
// Disable buttons initially
hitButton.disabled = true;
standButton.disabled = true;
resetButton.disabled = true;
// Initial win counters
updateWinCounters();
// Initial scores
updateScores();
// Initial result message
resultMessage.textContent = 'Press "Start New Game" to begin!';
// Initial class for result message
resultMessage.className = 'result';
// Add styles for bust effect
