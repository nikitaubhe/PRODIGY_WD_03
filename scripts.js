// script.js

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer;
let gameActive = false;
let againstAI = false;

const statusDisplay = document.querySelector('h1');
const gameBoard = document.querySelector('#game_board');
const resetButton = document.querySelector('#reset_button');
const symbolButtons = document.querySelectorAll('.symbol_button');
const modeSelection = document.querySelector('#mode_selection');
const symbolSelection = document.querySelector('#symbol_selection');
const playerVsPlayerButton = document.querySelector('#player_vs_player');
const playerVsAIButton = document.querySelector('#player_vs_ai');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkForWinner();
    if (againstAI && gameActive && currentPlayer === 'O') {
        setTimeout(aiMove, 500);  // AI makes a move after a short delay
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.innerHTML = `<img src="./assets/${currentPlayer === 'X' ? 'cross' : 'letter-o'}.png" alt="${currentPlayer}">`;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkForWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer === 'X' ? 'O' : 'X'} Wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusDisplay.innerHTML = 'Draw!';
        gameActive = false;
        return;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = false;
    againstAI = false;
    modeSelection.classList.remove('hidden');
    symbolSelection.classList.add('hidden');
    gameBoard.classList.add('hidden');
    resetButton.classList.add('hidden');
    statusDisplay.innerHTML = '<img src="./assets/logo.png" alt="logo" id="logo"> Tic-Tac-Toe';
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
}

function selectSymbol(event) {
    currentPlayer = event.target.closest('button').getAttribute('data-symbol');
    symbolSelection.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    gameActive = true;
    if (againstAI && currentPlayer === 'O') {
        aiMove();
    }
}

function selectMode(event) {
    const mode = event.target.id;
    againstAI = mode === 'player_vs_ai';
    modeSelection.classList.add('hidden');
    symbolSelection.classList.remove('hidden'); // Show symbol selection
}

function aiMove() {
    let availableCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableCells.push(i);
        }
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cellIndex = availableCells[randomIndex];
    const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);

    updateCell(cell, cellIndex);
    checkForWinner();
}

symbolButtons.forEach(button => button.addEventListener('click', selectSymbol));
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
playerVsPlayerButton.addEventListener('click', selectMode);
playerVsAIButton.addEventListener('click', selectMode);
