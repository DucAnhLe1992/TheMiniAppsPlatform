# The Platform

A comprehensive productivity platform built with React, TypeScript, and Supabase. The Platform provides a suite of integrated mini-apps to help you manage your daily tasks, track habits, organize notes, and stay productive.

## Features

### Core Applications

- **Todo List** - Create, organize, and track tasks with priorities and categories
- **Shopping List** - Collaborative shopping lists with real-time updates
- **Pomodoro Timer** - Focus timer with work and break sessions
- **Notes Manager** - Rich note-taking with code snippets and markdown support
- **Calendar** - Full-featured calendar with events, reminders, and recurring events
- **Habit Tracker** - Build and maintain daily habits with streak tracking
- **Currency Converter** - Real-time currency conversion with budget tracking
- **Weather Info** - Current weather and forecasts for saved locations
- **Text Summarizer** - AI-powered text summarization using OpenAI GPT-3.5

### Platform Features

- **User Authentication** - Secure email/password authentication with Supabase
- **Profile Management** - Comprehensive user profiles with statistics and settings
- **Data Export** - Export all your data in JSON format
- **Theme Support** - Light and dark mode with smooth transitions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Sync** - All data synced in real-time across devices

## Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Edge Functions
- **OpenAI API** - Text summarization
- **OpenWeather API** - Weather data
- **Exchange Rates API** - Currency conversion

### Architecture
- **Nx Monorepo** - Modular app architecture
- **Shared Libraries** - Reusable components and utilities
- **Edge Functions** - Serverless functions for API proxying

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key (for text summarizer)
- OpenWeather API key (for weather app)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd the-platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenWeather API Key
OPENWEATHER_API_KEY=your_openweather_api_key
```

4. Set up Supabase secrets:

In your Supabase dashboard, add the following Edge Function secret:
- `OPENAI_API_KEY` - Your OpenAI API key

5. Run database migrations:

All migrations are in `supabase/migrations/` and will be automatically applied.

6. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Project Structure

```
the-platform/
├── apps/                          # Mini applications
│   ├── calendar/                  # Calendar app
│   ├── currency-converter/        # Currency converter app
│   ├── habit-tracker/            # Habit tracking app
│   ├── notes-manager/            # Notes and code snippets app
│   ├── pomodoro-timer/           # Pomodoro timer app
│   ├── shopping-list/            # Shopping list app
│   ├── text-summarizer/          # AI text summarizer app
│   ├── todo-list/                # Todo list app
│   └── weather-info/             # Weather information app
├── libs/
│   └── shared/                   # Shared utilities and components
│       ├── hooks/                # Custom React hooks
│       ├── supabase/             # Supabase client
│       ├── theme/                # Theme configuration
│       └── types/                # TypeScript types
├── src/
│   ├── components/               # Core UI components
│   │   ├── AppShell.tsx         # Main app wrapper
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── ThemeWrapper.tsx     # Theme provider
│   ├── pages/                    # Main pages
│   │   ├── Dashboard.tsx        # Dashboard page
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   └── Profile.tsx          # User profile page
│   │       ├── ProfileSettings.tsx    # Profile settings
│   │       ├── ProfileStatistics.tsx  # User statistics
│   │       └── DataManagement.tsx     # Data export/delete
│   └── main.tsx                 # App entry point
├── supabase/
│   ├── functions/               # Edge Functions
│   │   ├── get-weather/         # Weather API proxy
│   │   ├── get-exchange-rates/  # Exchange rates API proxy
│   │   ├── search-locations/    # Location search proxy
│   │   └── summarize-text/      # OpenAI text summarization
│   └── migrations/              # Database migrations
├── package.json
├── tsconfig.json
├── vite.config.ts
└── nx.json
```

## API Keys Setup

### OpenWeather API
1. Sign up at https://openweathermap.org/api
2. Create a free API key
3. Add to `.env` as `OPENWEATHER_API_KEY`

### OpenAI API
1. Sign up at https://platform.openai.com/signup
2. Add payment method (required)
3. Generate API key at https://platform.openai.com/api-keys
4. Add to Supabase Edge Function secrets as `OPENAI_API_KEY`

## Database Schema

The platform uses PostgreSQL via Supabase with the following main tables:

- `user_profiles` - User profile information
- `user_preferences` - User settings and preferences
- `todos` - Todo items
- `notes` - Notes and code snippets
- `habits` - Habit definitions
- `habit_completions` - Habit completion records
- `events` - Calendar events
- `pomodoro_sessions` - Pomodoro timer sessions
- `shopping_lists` - Shopping list containers
- `shopping_list_items` - Shopping list items
- `saved_locations` - Saved weather locations
- `saved_conversions` - Currency conversion history
- `budgets` - Budget tracking

All tables implement Row Level Security (RLS) to ensure data privacy.

## Development

### Adding a New App

1. Create a new directory under `apps/`
2. Add the app component and index file
3. Create a `project.json` and `tsconfig.json`
4. Register the app in the database `apps` table
5. Add the route in `src/components/AppShell.tsx`
6. Add navigation item in `src/components/Sidebar.tsx`

### Database Migrations

Create new migrations in `supabase/migrations/`:

```sql
/*
  # Migration Description

  1. Changes
    - Description of changes

  2. Security
    - RLS policies
*/

-- Your SQL here
```

### Edge Functions

Deploy edge functions using the Supabase MCP tools or manually:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Your function logic here

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security

- All API keys must be stored as environment variables
- Database access is protected by Row Level Security
- Authentication is handled by Supabase Auth
- Edge Functions proxy external API calls to protect keys

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Acknowledgments

- Built with React and TypeScript
- Powered by Supabase
- UI animations by Framer Motion
- Weather data from OpenWeather
- AI summarization by OpenAI
