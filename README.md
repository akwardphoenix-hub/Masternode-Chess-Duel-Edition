# Masternode Chess: Duel Edition

⚔️ **Literally empirically the coolest most bamboozelest Chess game ever created besides actual Chess.**

This concept was ripped and stolen from chess cascadingly through all of the years of video games and board games. All the games all your games are belong to us.

## Features

- **Chess with RPG Mechanics**: Every piece has HP, XP, levels, and equipment
- **Duel System**: Combat resolves through mini-games (Rhythm Taps, Shape Tracing)
- **Progression**: Pieces level up, gain XP, and can purchase equipment
- **6 Unique Themes**: Roman Empire, French Royalty, Middle Eastern, Pirate Lords, Old English, Cyberpunk
- **Governance System**: Council modifiers that can adjust game balance mid-match
- **Audit Log**: Complete transparency with event logging and replay capability

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Game Rules

### Combat System
When pieces engage, players participate in a mini-game:
- **Perfect** (90+ score): 2x damage
- **Good** (70+ score): 1.5x damage  
- **Hit** (50+ score): 1x damage
- **Miss** (< 50 score): 0x damage

### Progression
- Earn XP from hits, perfects, and kills
- Level up to increase stats
- Purchase equipment with bounty gold
- King receives 10% trickle XP from allies

### Themes
Each theme provides unique unit names and special buffs:
- **Roman**: +20% defense on perfect blocks
- **French**: +1 initiative to all pieces
- **Middle Eastern**: +30% gold/bounty from kills
- **Pirate**: 15% critical hit chance
- **Old English**: +10 HP to all pieces
- **Cyberpunk**: +20% XP gain

## Project Structure

```
├── data/                  # JSON game data
│   ├── game.rules.json    # Damage, HP, progression rules
│   ├── themes.json        # Theme definitions
│   ├── equipment.json     # Purchasable equipment
│   ├── duels.json         # Duel mini-game configs
│   ├── governance.json    # Council modifiers
│   └── sample-match.json  # Initial game state
├── src/
│   ├── components/        # React components
│   │   ├── Board.tsx      # Chess board rendering
│   │   ├── Piece.tsx      # Piece with HP/level display
│   │   ├── DuelModal.tsx  # Duel mini-game modal
│   │   ├── GameInfo.tsx   # Game state panel
│   │   ├── GovernancePanel.tsx
│   │   ├── AuditLog.tsx
│   │   └── duels/         # Mini-game implementations
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Game logic utilities
│   └── App.tsx           # Main application
```

## Technologies

- **React 18** + **Vite** for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **JSON** data-driven game rules

## License

CC0 1.0 Universal - Public Domain
