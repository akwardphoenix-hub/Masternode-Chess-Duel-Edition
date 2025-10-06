// Main entry point for Masternode Chess Duel Edition
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
const gameBoard = document.querySelector<HTMLDivElement>('#game-board');

if (app && gameBoard) {
  gameBoard.innerHTML = `
    <div class="chess-board">
      <div class="square">♜</div>
      <div class="square">♞</div>
      <div class="square">♝</div>
      <div class="square">♛</div>
      <div class="square">♚</div>
      <div class="square">♝</div>
      <div class="square">♞</div>
      <div class="square">♜</div>
    </div>
  `;
}

console.log('Chess game initialized!');
