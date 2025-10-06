// Masternode Chess Duel Edition - Main Game Logic

const startButton = document.getElementById('start-game') as HTMLButtonElement
const gameStatus = document.getElementById('game-status') as HTMLDivElement

let gameStarted = false

if (startButton) {
  startButton.addEventListener('click', () => {
    if (!gameStarted) {
      gameStarted = true
      gameStatus.textContent = 'Game Started! Ready for chess duel!'
      startButton.textContent = 'Reset Game'
      startButton.setAttribute('data-game-state', 'started')
    } else {
      gameStarted = false
      gameStatus.textContent = ''
      startButton.textContent = 'Start Game'
      startButton.setAttribute('data-game-state', 'stopped')
    }
  })
}
