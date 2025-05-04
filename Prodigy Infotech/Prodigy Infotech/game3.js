document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const newGameButton = document.getElementById('new-game-button');
    const difficultyContainer = document.getElementById('difficulty-container');
    const difficultySelect = document.getElementById('difficulty-select');
    const vsPlayerButton = document.getElementById('vs-player');
    const vsAIButton = document.getElementById('vs-ai');
    const modal = document.getElementById('winner-modal');
    const winnerMessage = document.getElementById('winner-message');
    const playAgainButton = document.getElementById('play-again-btn');
    const confettiContainer = document.getElementById('confetti-container');
    
    // Score elements
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scoreDraw = document.getElementById('score-draw');
    
    // Game state
    let gameActive = true;
    let currentPlayer = 'x';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let vsAI = false;
    let aiDifficulty = 'medium';
    let scores = {
        x: 0,
        o: 0,
        draw: 0
    };
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Game messages
    const playerTurnMessage = () => `Player ${currentPlayer.toUpperCase()}'s turn`;
    const winningMessage = () => `Player ${currentPlayer.toUpperCase()} wins!`;
    const drawMessage = () => `Game ended in a draw!`;
    
    // Set up game mode listeners
    vsPlayerButton.addEventListener('click', () => setGameMode(false));
    vsAIButton.addEventListener('click', () => setGameMode(true));
    difficultySelect.addEventListener('change', () => {
        aiDifficulty = difficultySelect.value;
    });
    
    // Cell click handler
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        cellPlayed(clickedCell, clickedCellIndex);
        checkResult();
        
        if (gameActive && vsAI && currentPlayer === 'o') {
            setTimeout(() => {
                makeAIMove();
                checkResult();
            }, 500);
        }
    }
    
    // Cell played function
    function cellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer);
        
        // Add animation effect
        clickedCell.style.transform = 'scale(0.9)';
        setTimeout(() => {
            clickedCell.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Check result function
    function checkResult() {
        let roundWon = false;
        let winningCombo = null;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (
                gameState[a] !== '' &&
                gameState[a] === gameState[b] &&
                gameState[a] === gameState[c]
            ) {
                roundWon = true;
                winningCombo = winningConditions[i];
                break;
            }
        }
        
        if (roundWon) {
            gameActive = false;
            highlightWinningCells(winningCombo);
            
            // Update scores
            scores[currentPlayer]++;
            updateScore();
            
            // Show winner modal with a slight delay
            setTimeout(() => {
                showWinnerModal(winningMessage());
                createConfetti();
            }, 800);
            
            return;
        }
        
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            gameActive = false;
            
            // Update scores
            scores.draw++;
            updateScore();
            
            // Show draw modal with a slight delay
            setTimeout(() => {
                showWinnerModal(drawMessage());
            }, 800);
            
            return;
        }
        
        changePlayer();
    }
    
    // Change player function
    function changePlayer() {
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        status.textContent = playerTurnMessage();
        
        // Add subtle animation to status
        status.style.transform = 'scale(1.05)';
        setTimeout(() => {
            status.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Reset game function
    function resetGame() {
        gameActive = true;
        currentPlayer = 'x';
        gameState = ['', '', '', '', '', '', '', '', ''];
        status.textContent = playerTurnMessage();
        
        cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'win');
            cell.style.transform = '';
        });
        
        // Hide modal if it's open
        modal.style.display = 'none';
        
        // AI move if AI is player O and goes first
        if (vsAI && currentPlayer === 'o') {
            setTimeout(() => {
                makeAIMove();
                checkResult();
            }, 400);
        }
    }
    
    // Start new game function (reset game + reset scores)
    function newGame() {
        scores = { x: 0, o: 0, draw: 0 };
        updateScore();
        resetGame();
    }
    
    // Update score function
    function updateScore() {
        scoreX.textContent = scores.x;
        scoreO.textContent = scores.o;
        scoreDraw.textContent = scores.draw;
        
        // Add animation to updated score
        if (currentPlayer === 'x' || !gameActive) {
            scoreX.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scoreX.style.transform = 'scale(1)';
            }, 300);
        } else {
            scoreO.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scoreO.style.transform = 'scale(1)';
            }, 300);
        }
        
        if (!gameActive && !gameState.includes('')) {
            scoreDraw.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scoreDraw.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // Set game mode function
    function setGameMode(aiMode) {
        vsAI = aiMode;
        if (vsAI) {
            vsPlayerButton.classList.remove('active');
            vsAIButton.classList.add('active');
            difficultyContainer.classList.remove('hidden');
        } else {
            vsPlayerButton.classList.add('active');
            vsAIButton.classList.remove('active');
            difficultyContainer.classList.add('hidden');
        }
        newGame();
    }
    
    // Highlight winning cells
    function highlightWinningCells(winCombo) {
        winCombo.forEach(index => {
            cells[index].classList.add('win');
        });
    }
    
    // Show winner modal
    function showWinnerModal(message) {
        winnerMessage.textContent = message;
        modal.style.display = 'block';
    }
    
    // Create confetti effect
    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.transform = 'translateY(0)';
            confetti.style.opacity = '1';
            
            const animation = confetti.animate([
                { transform: 'translateY(0)', opacity: 1 },
                { transform: `translateY(${Math.random() * 400 + 200}px) 
                              translateX(${Math.random() * 200 - 100}px) 
                              rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            confettiContainer.appendChild(confetti);
            
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }
    
    // Get random color for confetti
    function getRandomColor() {
        const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // AI Move function
    function makeAIMove() {
        // Find an empty cell based on difficulty level
        let cellIndex;
        
        switch (aiDifficulty) {
            case 'easy':
                cellIndex = getRandomEmptyCell();
                break;
            case 'medium':
                // 70% chance of making a smart move, 30% chance of random move
                if (Math.random() < 0.7) {
                    cellIndex = getBestMove();
                } else {
                    cellIndex = getRandomEmptyCell();
                }
                break;
            case 'hard':
                cellIndex = getBestMove();
                break;
            default:
                cellIndex = getRandomEmptyCell();
        }
        
        // Make the move
        gameState[cellIndex] = currentPlayer;
        cells[cellIndex].classList.add(currentPlayer);
        
        // Add animation effect
        cells[cellIndex].style.transform = 'scale(0.9)';
        setTimeout(() => {
            cells[cellIndex].style.transform = 'scale(1)';
        }, 150);
    }
    
    // Get random empty cell
    function getRandomEmptyCell() {
        const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    // Get best move (for medium and hard difficulty)
    function getBestMove() {
        // Check if AI can win with one move
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            // Check if AI can win
            if (gameState[a] === currentPlayer && gameState[b] === currentPlayer && gameState[c] === '') {
                return c;
            }
            if (gameState[a] === currentPlayer && gameState[c] === currentPlayer && gameState[b] === '') {
                return b;
            }
            if (gameState[b] === currentPlayer && gameState[c] === currentPlayer && gameState[a] === '') {
                return a;
            }
        }
        
        // Check if player can win with one move and block it
        const opponentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            // Check if opponent can win
            if (gameState[a] === opponentPlayer && gameState[b] === opponentPlayer && gameState[c] === '') {
                return c;
            }
            if (gameState[a] === opponentPlayer && gameState[c] === opponentPlayer && gameState[b] === '') {
                return b;
            }
            if (gameState[b] === opponentPlayer && gameState[c] === opponentPlayer && gameState[a] === '') {
                return a;
            }
        }
        
        // Take center if available
        if (gameState[4] === '') {
            return 4;
        }
        
        // Take corners if available
        const corners = [0, 2, 6, 8].filter(idx => gameState[idx] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }
        
        // Take any available edge
        const edges = [1, 3, 5, 7].filter(idx => gameState[idx] === '');
        if (edges.length > 0) {
            return edges[Math.floor(Math.random() * edges.length)];
        }
        
        // Fallback to any random empty cell
        return getRandomEmptyCell();
    }
    
    // Add event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', newGame);
    playAgainButton.addEventListener('click', resetGame);
    
    // Set initial state
    setGameMode(false); // Start with Player vs Player
});