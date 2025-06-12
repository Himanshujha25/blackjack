const start = document.querySelector('#btn-start');
const hitButton = document.querySelector('#btn-hit');
const standButton = document.querySelector('#btn-stand');
const resetButton = document.querySelector('#btn-reset');
const playerScoreElement = document.querySelector('#player-score');
const dealerScoreElement = document.querySelector('#dealer-score');
const dealerCardsContainer = document.querySelector('#dealer-cards');
const playerCardsContainer = document.querySelector('#player-cards');
const resultMessage = document.getElementById('result-message');
const playerWin = document.querySelector('.win-player');
const dealerWin = document.querySelector('.win');
const totalWinPlayer = document.querySelector('.totalwin-p');
const totalWinDealer = document.querySelector('.totalwin-d');

let playerScore = 0;
let dealerScore = 0;
let gameStarted = false;
let playerWins = 0;
let dealerWins = 0;

function getRandomCardValue() {
  return Math.floor(Math.random() * 11) + 1; // returns 1–11
}

function getRandomCardValue() {
  return Math.floor(Math.random() * 13) + 1; // 1–13
}

function drawCard(container) {
  const value = getRandomCardValue();
  const card = document.createElement('div');
  card.className = 'card';

  // Set card text and game value
  let cardText = '';
  let gameValue = 0;

  if (value === 1) {
    cardText = 'A';
    gameValue = 11; // Ace usually counts as 11 (can adjust later if needed)
  } else if (value === 11) {
    cardText = 'J';
    gameValue = 10;
  } else if (value === 12) {
    cardText = 'Q';
    gameValue = 10;
  } else if (value === 13) {
    cardText = 'K';
    gameValue = 10;
  } else {
    cardText = value.toString();
    gameValue = value;
  }

  // Set card display
  card.textContent = cardText;

  // Optionally assign red color to simulate hearts or diamonds
  const isRedSuit = Math.random() < 0.5;
  if (isRedSuit) {
    card.classList.add('red');
  }

  container.appendChild(card);
  return gameValue;
}


function updateScore() {
  playerScoreElement.textContent = `Score: ${playerScore}`;
}

function startGame() {
  alert('Game Started! Click "Hit" to draw a card or "Stand" to end your turn.');
  gameStarted = true;
  playerScore = 0;
  dealerScore = 0;
  playerCardsContainer.innerHTML = '';
  dealerCardsContainer.innerHTML = '';
  resultMessage.textContent = '';
  updateScore();
  dealerScoreElement.textContent = `Score: 0`;
}

function playerHit() {
  if (!gameStarted) return;
  const value = drawCard(playerCardsContainer);
  playerScore += value;
  updateScore();

  if (playerScore > 21) {
    resultMessage.textContent = "Bust! You went over 21.";
    resultMessage.style.color = 'red';
    playerScoreElement.style.color = 'red';
    gameStarted = false;
  }
}

function playerStand() {
  if (!gameStarted) return;

  // Dealer's turn
  dealerScore = 0;
  dealerCardsContainer.innerHTML = '';

  while (dealerScore < 17) {
    const value = drawCard(dealerCardsContainer);
    dealerScore += value;
  }

  dealerScoreElement.textContent = `Score: ${dealerScore}`;

  // Compare scores
  let result = '';
  
  if (dealerScore > 21 || playerScore > dealerScore) {
    result = 'You Win!';
    playerWins++;
    totalWinPlayer.textContent = `total win:${playerWins}`;
  
  } else if (playerScore === dealerScore) {
    result = 'It\'s a Draw!';


  } else {
    result = 'Dealer Wins!';
    dealerWins++;
    totalWinDealer.textContent = `total win:${dealerWins}`;
   
  }

  resultMessage.textContent = result;
    resultMessage.style.color = dealerScore > 21 || playerScore > dealerScore ? 'green' : 'red';
    if(playerScore === dealerScore){
    resultMessage.style.color = 'white';
    }
  gameStarted = false;
}

function resetGame() {
    alert('Game Reset! Click "Start" to play again.');
  playerScore = 0;
  dealerScore = 0;
  gameStarted = false;
   playerScoreElement.style.color = 'black';
    dealerScoreElement.style.color = 'black';
  playerCardsContainer.innerHTML = '';
  dealerCardsContainer.innerHTML = '';
  resultMessage.textContent = '';

  updateScore();
  dealerScoreElement.textContent = `Score: 0`;
}

// Button Event Listeners
start.addEventListener('click', startGame);
hitButton.addEventListener('click', playerHit);
standButton.addEventListener('click', playerStand);
resetButton.addEventListener('click', resetGame);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (key === ' ') {
    startGame();
  } else if (key === 'h') {
    playerHit();
  } else if (key === 's') {
    playerStand();
  } else if (key === 'r') {
    resetGame();
  }
});
