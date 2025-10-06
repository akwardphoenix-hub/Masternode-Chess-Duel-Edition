# Masternode Chess: Duel Edition - Demo Guide

## Quick Start

### Installation
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## Game Features Demo

### 1. Viewing Pieces
When you start the game, you'll see:
- White pieces on the left side
- Black pieces on the right side
- Each piece displays:
  - Type and level
  - Current HP / Max HP with visual bar
  - XP progress
  - Equipped items (weapons, armor, accessories)
  - Current position on board

### 2. Starting a Duel
1. Click on any piece to select it
2. Choose a duel type from the bottom menu:
   - **Swipe Duel**: Quick reflexes - swipe arrows in the correct direction
   - **Rhythm Duel**: Timing - hit notes as they reach the target line
   - **Mirror Duel**: Memory - memorize and repeat a number pattern

### 3. Playing Mini-Games

#### Swipe Duel
- Watch the arrow that appears
- Click the corresponding direction button (↑↓←→)
- Get perfect scores by matching all arrows correctly
- Wrong inputs incur penalties

#### Rhythm Duel
- Notes fall from the top of the screen
- Press "HIT!" when notes reach the green line
- Timing determines accuracy:
  - Perfect: Within 50ms
  - Good: Within 150ms
  - Miss: Beyond 150ms

#### Mirror Duel
- Pattern appears for 3 seconds
- Memorize the sequence of numbers
- Reproduce the pattern using number buttons (0-9)
- Bonus points for consecutive correct matches

### 4. Duel Resolution
After completing a mini-game:
- Scores are compared (attacker vs defender)
- Damage is calculated based on:
  - Score difference
  - Attack/Defense stats
  - Equipment bonuses
  - Theme buffs
- XP is awarded to both participants
- Pieces may level up if XP threshold is reached
- Results are shown in the "Last Duel Result" panel

## Theme System

Each game uses one of six themes, providing unique buffs:

### Roman Empire
- **Buff**: +20% Attack Damage
- **Best for**: Aggressive strategies, high-damage pieces

### French Nobility
- **Buff**: +15% HP
- **Best for**: Defensive play, keeping pieces alive longer

### Middle-Eastern Sultanate
- **Buff**: +25% XP Gain
- **Best for**: Long games, faster leveling

### Pirate Crew
- **Buff**: +30% Bounty Rewards
- **Best for**: Resource accumulation strategies

### Old English Kingdom
- **Buff**: +10% to All Stats
- **Best for**: Balanced gameplay

### Cyberpunk Future
- **Buff**: +15% Critical Hit Chance
- **Best for**: Risk-takers, high-reward strategies

## Sample Match

The game starts with a pre-loaded sample match featuring:
- **Theme**: Pirate (30% bounty bonus)
- **Turn**: 5
- **White Pieces**: King, Queen, Rook, Knight, Pawn
- **Black Pieces**: King, Queen, Rook, Bishop, Pawn
- **Last Duel**: Knight defeated Pawn in a Swipe Duel

## Testing the Game

### Run Unit Tests
```bash
npm test
```

### Run with Coverage
```bash
npm run test:coverage
```

### Test Individual Duels (Node REPL)
```javascript
const { SwipeDuel, RhythmDuel, MirrorDuel, DuelManager } = require('./dist/index.js');

// Test Swipe Duel
const swipe = new SwipeDuel(5, 100);
const sequence = swipe.getSequence();
console.log('Sequence:', sequence);

sequence.forEach(dir => swipe.addInput(dir));
console.log('Score:', swipe.calculateScore()); // Should be 100

// Test Rhythm Duel
const rhythm = new RhythmDuel(10, 100);
const notes = rhythm.getNotes();
notes.forEach(note => rhythm.hitNote(note));
console.log('Score:', rhythm.calculateScore());

// Test Mirror Duel
const mirror = new MirrorDuel(8, 100);
const pattern = mirror.getPattern();
console.log('Pattern:', pattern);
pattern.forEach(num => mirror.addInput(num));
console.log('Score:', mirror.calculateScore()); // Should be 100+
```

## Extending the Game

### Adding New Duel Types
1. Create a new class in `src/duel/`
2. Implement the duel interface with score calculation
3. Add to `DuelManager.createDuel()` switch statement
4. Create a React component in `src/components/`
5. Add tests in `src/__tests__/`

### Adding New Themes
1. Add theme definition to `game.rules.json`
2. Theme system will automatically pick it up
3. Update TypeScript `ThemeType` in `src/types/index.ts`

### Adding New Equipment
1. Add to `game.rules.json` sample match
2. Equipment system supports any bonus type
3. DuelManager will use attack/defense values automatically

## Performance Tips

- Duel mini-games are optimized for 60fps
- TypeScript provides type safety for all game logic
- React components use inline styles for fast rendering
- Game state is managed efficiently with hooks

## Troubleshooting

### Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Test Failures
Ensure you're using Node 18+ and compatible package versions.

### Port Already in Use
If port 3000 is in use:
```bash
npm run dev -- --port 3001
```
