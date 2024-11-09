// Get the game board element where the cards will be displayed
const gameBoard = document.getElementById('game-board'); 

// Get the element that displays the number of moves made by the player
const movesCounter = document.getElementById('moves'); 

// Get the element that displays the number of matched pairs found by the player
const matchesCounter = document.getElementById('matches'); 

// Array of unique icons (emojis) representing card faces
const icons = ['🍎', '🍊', '🍇', '🍓', '🍒', '🍉', '🍍', '🥝']; 

// Duplicate the icons array to create pairs of each icon for the matching game
let cards = [...icons, ...icons]; 

// Array to temporarily hold the two cards currently flipped by the player
let flippedCards = []; 

// Counter to track the number of moves (every time two cards are flipped)
let moves = 0; 

// Counter to track the number of matched pairs (when two flipped cards match)
let matchedPairs = 0; 

// Load sound effects for various game events
const flipSound = new Audio('flip.mp3'); // Sound for card flip
const matchSound = new Audio('match.wav'); // Sound when a match is found
const mismatchSound = new Audio('mismatch.wav'); // Sound when cards do not match
const winSound = new Audio('win.wav'); // Sound played upon winning the game
const bgMusic = new Audio('bgmusic.mp3'); // Background music for the game
bgMusic.loop = true; // Ensures the background music loops continuously

// Function to shuffle an array using the Fisher-Yates algorithm
//The Fisher–Yates shuffle is an algorithm for shuffling a finite sequence. The algorithm takes a list of all the elements of the sequence, and continually
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements at index i and j
  }
}

// Function to create a card element and attach event listeners
function createCard(icon) {
  const card = document.createElement('div'); // Create a new div for the card
  card.classList.add('card'); // Add the 'card' class for styling
  card.dataset.icon = icon; // Store the card's icon in a data attribute

  // Add a click event listener for flipping the card
  card.addEventListener('click', () => {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
      flipSound.play(); // Play the flip sound effect
      card.classList.add('flipped'); // Mark the card as flipped
      card.innerHTML = icon; // Display the icon on the card
      flippedCards.push(card); // Add the card to the flipped cards array

      if (flippedCards.length === 2) {
        checkMatch(); // Check if the two flipped cards match
      }
    }
  });

  return card; // Return the created card element
}

// Function to check if the two flipped cards match
function checkMatch() {
  moves++; // Increment the move counter
  movesCounter.textContent = moves; // Update the moves display

  const [card1, card2] = flippedCards; // Destructure the flipped cards array

  if (card1.dataset.icon === card2.dataset.icon) {
    // If the cards match:
    matchedPairs++; // Increment the matched pairs counter
    matchesCounter.textContent = matchedPairs; // Update the matches display
    card1.classList.add('matched'); // Mark the first card as matched
    card2.classList.add('matched'); // Mark the second card as matched
    matchSound.play(); // Play the match sound effect
    flippedCards = []; // Reset the flipped cards array

    if (matchedPairs === icons.length) {
      // If all pairs are matched, the player wins
      setTimeout(() => showVictory(), 300); // Show victory message after a short delay
    }
  } else {
    // If the cards do not match:
    mismatchSound.play(); // Play the mismatch sound effect
    card1.classList.add('shake'); // Add shake animation to the first card
    card2.classList.add('shake'); // Add shake animation to the second card
    setTimeout(() => {
      card1.classList.remove('flipped', 'shake'); // Unflip and remove animation
      card2.classList.remove('flipped', 'shake'); // Unflip and remove animation
      card1.innerHTML = ''; // Clear the first card's content
      card2.innerHTML = ''; // Clear the second card's content
      flippedCards = []; // Reset the flipped cards array
    }, 1000); // Wait for 1 second before unflipping the cards
  }
}

// Function to display the victory message and prompt for replay
function showVictory() {
  winSound.play(); // Play the victory sound

  const victoryMessage = document.createElement('div'); // Create a victory message div
  victoryMessage.id = 'victory'; // Set the ID for styling
  victoryMessage.textContent = '🎉 You Win! 🎉'; // Set the message content
  document.body.appendChild(victoryMessage); // Add the message to the body
  victoryMessage.style.display = 'block'; // Display the message

  setTimeout(() => {
    const playAgain = confirm('Congratulations! You matched all pairs! 🎉\n\nDo you want to play again?');
    victoryMessage.remove(); // Remove the victory message
    if (playAgain) {
      resetGame(); // Reset and restart the game if the player wants to play again
    }
  }, 3000); // Delay the prompt for 3 seconds
}

// Function to reset the game state and start a new game
function resetGame() {
  moves = 0; // Reset the moves counter
  matchedPairs = 0; // Reset the matched pairs counter
  movesCounter.textContent = moves; // Reset the moves display
  matchesCounter.textContent = matchedPairs; // Reset the matches display
  flippedCards = []; // Clear the flipped cards array

  gameBoard.innerHTML = ''; // Clear the game board
  shuffle(cards); // Shuffle the cards
  startGame(); // Start a new game
}

// Function to initialize and start the game
function startGame() {
  shuffle(cards); // Shuffle the cards
  cards.forEach(icon => {
    const card = createCard(icon); // Create a card for each icon
    gameBoard.appendChild(card); // Add the card to the game board
  });
}

// Start the game when the page loads
startGame();
