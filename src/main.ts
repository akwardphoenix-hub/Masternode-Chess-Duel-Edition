// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  const gameBoard = document.querySelector('#game-board');
  
  if (gameBoard) {
    gameBoard.innerHTML = '<p>Chess game ready! Let the duel begin.</p>';
  }
  
  // Mark app as ready for E2E tests
  if (app) {
    app.setAttribute('data-app-ready', 'true');
  }
  
  console.log('Masternode Chess Duel Edition initialized');
});
