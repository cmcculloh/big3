# Big 3 - Exercise App

A beautiful, simple follow-along exercise app built with SvelteKit, SCSS, and vanilla JavaScript.

## Features

### 🏋️ Exercise Management
- **Custom Routines**: Create personalized workout routines with sets, reps, and duration tracking
- **Exercise Library**: Browse and search exercises by category and equipment type
- **Equipment Support**: Track weights, resistance bands, and bodyweight exercises
- **Detailed Instructions**: Each exercise includes step-by-step instructions

### ⏱️ Smart Workout Sessions
- **Timer Integration**: Built-in countdown timer with audio cues for timed exercises
- **Rep Tracking**: Simple rep-based exercises with manual completion
- **Rest Periods**: Configurable rest times between sets and exercises
- **Progress Tracking**: Visual progress bar during workouts

### 📊 Progress Tracking
- **Difficulty Rating**: Rate exercises using 😊😐☹️ scale
- **Automatic Weight Adjustment**: App suggests weight changes based on difficulty ratings
- **Workout History**: Detailed tracking of all completed workouts
- **Performance Analytics**: View exercise difficulty distribution and trends

### 🎯 Auto-Generation
- **Smart Suggestions**: Get personalized workout recommendations based on goals and equipment
- **Equipment-Based**: Routines adapt to available equipment (weights, bands, bodyweight)

## Tech Stack

- **Frontend**: SvelteKit 5.0
- **Styling**: SCSS (no Tailwind)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Lucia Auth
- **Language**: Vanilla JavaScript (no TypeScript)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd big3
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and other settings
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── Button.svelte
│   │   ├── Card.svelte
│   │   ├── Timer.svelte
│   │   ├── DifficultyRating.svelte
│   │   └── nav.svelte
│   └── server/
│       ├── db/             # Database schema and utilities
│       └── auth.js         # Authentication setup
├── routes/                 # SvelteKit pages
│   ├── +page.svelte        # Home page
│   ├── routines/           # Routine management
│   ├── exercises/          # Exercise library
│   ├── workout/            # Active workout sessions
│   ├── workouts/           # Workout history
│   └── history/            # Detailed progress tracking
└── static/                 # Static assets and CSS
```

## Key Components

### Timer Component
- Countdown functionality with audio cues
- Auto-start and manual control options
- Visual feedback for time remaining

### Difficulty Rating
- Emoji-based difficulty scale (😊😐☹️)
- Used for automatic weight adjustment suggestions
- Tracks exercise performance over time

### Workout Session
- Guided exercise flow with progress tracking
- Automatic progression between sets and exercises
- Difficulty rating collection after each exercise

## Database Schema

The app uses a comprehensive database schema including:
- **Users**: Authentication and user preferences
- **Exercises**: Exercise library with categories and equipment
- **Routines**: Workout routines with exercise templates
- **Workout Sessions**: Individual workout tracking
- **Set Performance**: Detailed performance data with difficulty ratings
- **User Settings**: Preferences for weight units, auto-adjustment, etc.

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

### Adding New Features
1. Create new components in `src/lib/components/`
2. Add new routes in `src/routes/`
3. Update database schema in `src/lib/server/db/schema.js`
4. Add server-side logic in `src/lib/server/db/index.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
