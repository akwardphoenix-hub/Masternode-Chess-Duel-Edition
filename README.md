# Masternode Chess: Duel Edition

Literally empirically the coolest most bamboozelest Chess game ever created besides actual Chess. This concept was ripped and stolen from chess cascadingly through all of the years of video games and board games. All the games all your games are belong to us.

## Overview

Masternode Chess: Duel Edition is a chess variant with RPG elements where pieces have HP, XP, equipment, and bounties. When pieces attack each other, they engage in quick mini-game duels to determine the outcome.

## Features

### 🎮 Duel Mini-Games
- **Swipe Duel**: Swipe arrows in the correct direction
- **Rhythm Duel**: Hit notes at the right time with perfect/good/miss accuracy
- **Mirror Duel**: Memorize and replicate a pattern

### ⚔️ RPG Mechanics
- **HP System**: Pieces have health points and can be defeated
- **XP & Leveling**: Pieces gain experience and level up
- **Equipment**: Pieces can equip weapons, armor, and accessories
- **Bounties**: Earn rewards for defeating enemy pieces

### 🎨 Themes
Each theme provides unique buffs to your pieces:
- **Roman Empire**: +20% attack damage
- **French Nobility**: +15% HP
- **Middle-Eastern Sultanate**: +25% XP gain
- **Pirate Crew**: +30% bounty rewards
- **Old English Kingdom**: +10% to all stats
- **Cyberpunk Future**: +15% critical hit chance

## Installation

```bash
npm install
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Project Structure

```
src/
├── types/              # TypeScript type definitions
├── duel/               # Duel mini-game logic
│   ├── swipeDuel.ts
│   ├── rhythmDuel.ts
│   ├── mirrorDuel.ts
│   └── duelManager.ts
├── components/         # React components
│   ├── PieceCard.tsx
│   ├── SwipeDuelComponent.tsx
│   ├── RhythmDuelComponent.tsx
│   ├── MirrorDuelComponent.tsx
│   └── GameBoard.tsx
├── utils/              # Utility functions
│   └── themeUtils.ts
└── __tests__/          # Test files
```

## Game Rules

See [game.rules.json](./game.rules.json) for detailed game rules and a sample match configuration.

### Piece Stats
- **Pawn**: 30 HP, 5 ATK, 10 Bounty
- **Knight**: 60 HP, 15 ATK, 30 Bounty
- **Bishop**: 50 HP, 12 ATK, 30 Bounty
- **Rook**: 80 HP, 18 ATK, 50 Bounty
- **Queen**: 100 HP, 25 ATK, 90 Bounty
- **King**: 150 HP, 20 ATK, 0 Bounty

### Duel Resolution
1. Attacker and defender engage in a mini-game
2. Both players receive a score (0-100)
3. Damage is calculated based on:
   - Score difference
   - Attacker's attack stat + equipment
   - Defender's defense stat + equipment
   - Theme buffs
4. XP is awarded based on outcome
5. Pieces level up at XP thresholds

## Usage Example

```typescript
import { DuelManager, SwipeDuel } from 'masternode-chess-duel-edition';

// Create a duel manager with a theme
const manager = new DuelManager('pirate');

// Create a swipe duel
const duel = manager.createDuel('swipe');

// Get the sequence to display
const sequence = duel.getSequence();

// Player inputs
duel.addInput('up');
duel.addInput('down');
// ... continue until complete

// Calculate score
const score = duel.calculateScore();

// Resolve the duel between two pieces
const result = manager.resolveDuel(attacker, defender, 'swipe', attackerScore, defenderScore);

// Apply the result
manager.applyDuelResult(attacker, defender, result);
```

## License

CC0 1.0 Universal - See [LICENSE](./LICENSE) for details.
