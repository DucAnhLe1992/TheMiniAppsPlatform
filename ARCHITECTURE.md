# Architecture Documentation

This document provides a comprehensive overview of The Platform's architecture, design patterns, and technical implementation details.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Database Schema](#database-schema)
8. [API Design](#api-design)
9. [State Management](#state-management)
10. [Deployment](#deployment)

---

## System Overview

The Platform is a full-stack web application built using a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Application (Vite)                   │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  App Shell (Router, Auth, Theme)                 │  │ │
│  │  │  ┌────────────────────────────────────────────┐  │  │ │
│  │  │  │         Mini Apps (Modular)                │  │  │ │
│  │  │  │  • Todo List    • Calendar                 │  │  │ │
│  │  │  │  • Notes        • Habits                   │  │  │ │
│  │  │  │  • Shopping     • Weather                  │  │  │ │
│  │  │  └────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Platform                        │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   Auth     │  │  PostgreSQL  │  │  Edge Functions  │    │
│  │  Service   │  │   Database   │  │   (Deno)         │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  External APIs │
                    │  • OpenAI      │
                    │  • OpenWeather │
                    │  • ExchangeRate│
                    └───────────────┘
```

---

## Architecture Patterns

### 1. Monorepo Structure (Nx)

The project uses Nx to manage a monorepo with multiple applications and shared libraries:

```
workspace/
├── apps/              # Independent mini applications
├── libs/shared/       # Shared code and utilities
└── src/               # Core platform code
```

**Benefits:**
- Code sharing and reusability
- Consistent tooling and configuration
- Easier dependency management
- Independent deployment capabilities

### 2. Micro-Frontend Pattern

Each mini-app is developed as an independent module with its own:
- Component structure
- State management
- Type definitions
- Business logic

**Benefits:**
- Team scalability
- Independent development cycles
- Easier testing and maintenance
- Reduced coupling

### 3. Backend-as-a-Service (BaaS)

Supabase provides managed backend services:
- Authentication
- Database (PostgreSQL)
- Real-time subscriptions
- Storage
- Edge Functions

**Benefits:**
- Reduced infrastructure management
- Built-in security features
- Automatic scaling
- Faster development

---

## Frontend Architecture

### Component Hierarchy

```
App
└── ThemeWrapper (Theme Context)
    └── Router
        ├── Login/Register (Unauthenticated)
        └── AppShell (Authenticated)
            ├── Sidebar (Navigation)
            └── MainContent
                ├── Dashboard
                ├── Profile
                └── Mini Apps
                    ├── TodoList
                    ├── Calendar
                    ├── NotesManager
                    ├── HabitTracker
                    └── ... (other apps)
```

### Core Components

#### 1. AppShell
**Location:** `src/components/AppShell.tsx`

**Responsibilities:**
- Authentication state management
- Route configuration
- Session handling
- App layout structure

**Key Features:**
- Automatic redirect for unauthenticated users
- Session persistence
- Auth state subscription

#### 2. Sidebar
**Location:** `src/components/Sidebar.tsx`

**Responsibilities:**
- Navigation menu
- App list
- Theme toggle
- User logout

**Key Features:**
- Responsive design (mobile/desktop)
- Active route highlighting
- Collapsible on mobile

#### 3. ThemeWrapper
**Location:** `src/components/ThemeWrapper.tsx`

**Responsibilities:**
- Theme provider
- Theme persistence
- Dark/light mode switching

**Key Features:**
- System preference detection
- Local storage sync
- Smooth transitions

### Shared Libraries

**Location:** `libs/shared/src/`

#### Hooks
- `useTheme` - Theme management
- `useApps` - App list management
- `useUserPreferences` - User settings

#### Types
- `app.types.ts` - Application types
- `database.types.ts` - Database schema types

#### Utilities
- `client.ts` - Supabase client singleton
- `theme/index.ts` - Theme configuration

---

## Backend Architecture

### Supabase Services

#### 1. Authentication
- Email/password authentication
- JWT-based session management
- Automatic profile creation on signup
- Secure password reset flow

#### 2. Database (PostgreSQL)
- Relational data model
- Row Level Security (RLS)
- Triggers and functions
- Automatic timestamps

#### 3. Edge Functions (Deno)
- Serverless function runtime
- API proxying for third-party services
- Secure credential management
- CORS handling

### Edge Functions Architecture

```typescript
// Standard Edge Function Structure

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// CORS headers (required for all functions)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  // 1. Handle OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // 2. Parse request
    const body = await req.json();

    // 3. Validate input
    if (!body.requiredField) {
      return new Response(
        JSON.stringify({ error: 'Missing required field' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Call external API
    const response = await fetch(externalAPI, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('API_KEY')}`,
      },
    });

    const data = await response.json();

    // 5. Return response
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // 6. Error handling
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### Current Edge Functions

1. **get-weather** - Proxies OpenWeather API calls
2. **get-exchange-rates** - Fetches currency exchange rates
3. **search-locations** - Location geocoding for weather
4. **summarize-text** - OpenAI text summarization

---

## Data Flow

### Authentication Flow

```
User Action (Login)
    │
    ▼
Frontend: supabase.auth.signInWithPassword()
    │
    ▼
Supabase Auth Service
    │
    ├── Validate credentials
    ├── Generate JWT
    └── Return session
    │
    ▼
Frontend: Store session, update UI
    │
    ▼
Database Trigger: Create user_profile
    │
    ▼
Frontend: Load user data
```

### Data Persistence Flow

```
User Action (Create Todo)
    │
    ▼
Frontend: supabase.from('todos').insert()
    │
    ▼
Supabase: Check RLS policies
    │
    ├── Policy: User owns record?
    └── If authorized:
        │
        ▼
    PostgreSQL: Insert record
        │
        ▼
    Real-time: Broadcast change
        │
        ▼
    Frontend: Update UI
```

### Edge Function Flow

```
Frontend: Fetch weather data
    │
    ▼
Edge Function: get-weather
    │
    ├── Verify JWT
    ├── Get API key from env
    └── Call OpenWeather API
    │
    ▼
OpenWeather API: Return data
    │
    ▼
Edge Function: Transform response
    │
    ▼
Frontend: Display data
```

---

## Security Architecture

### Row Level Security (RLS)

All tables implement RLS policies to ensure data isolation:

```sql
-- Example: Todos table RLS

-- Users can only see their own todos
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can only insert their own todos
CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own todos
CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own todos
CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### Authentication Security

1. **JWT Tokens**
   - Short-lived access tokens
   - Automatic refresh
   - Secure storage in memory

2. **Password Security**
   - Bcrypt hashing
   - Minimum complexity requirements
   - Secure reset flow

3. **Session Management**
   - Automatic expiration
   - Refresh token rotation
   - Logout on all devices

### API Security

1. **Edge Functions**
   - JWT verification required
   - Environment-based secrets
   - Rate limiting (Supabase managed)

2. **External APIs**
   - Keys stored in environment
   - Never exposed to frontend
   - Proxied through Edge Functions

---

## Database Schema

### Core Tables

#### user_profiles
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  bio text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### user_preferences
```sql
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'auto',
  favorite_apps text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### todos
```sql
CREATE TABLE todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  priority text DEFAULT 'medium',
  category text,
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Relationships

```
auth.users (Supabase managed)
    │
    ├──► user_profiles (1:1)
    ├──► user_preferences (1:1)
    ├──► todos (1:many)
    ├──► notes (1:many)
    ├──► habits (1:many)
    ├──► events (1:many)
    ├──► shopping_lists (1:many)
    └──► saved_locations (1:many)
```

### Database Triggers

#### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

#### Auto-create user profile
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

## API Design

### Frontend API Calls

#### Supabase Client Usage

```typescript
import { supabase } from '@shared';

// Query data
const { data, error } = await supabase
  .from('todos')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Insert data
const { data, error } = await supabase
  .from('todos')
  .insert({
    title: 'New todo',
    user_id: userId,
  });

// Update data
const { data, error } = await supabase
  .from('todos')
  .update({ completed: true })
  .eq('id', todoId);

// Delete data
const { data, error } = await supabase
  .from('todos')
  .delete()
  .eq('id', todoId);
```

#### Edge Function Calls

```typescript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/function-name`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ param: 'value' }),
  }
);

const data = await response.json();
```

---

## State Management

### Component State (useState)

Used for local UI state:
- Form inputs
- Modal visibility
- Loading states
- Error messages

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Context API (React Context)

Used for global application state:
- Theme (dark/light mode)
- Authentication session
- User preferences

```typescript
const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### Server State (Supabase)

Database acts as source of truth:
- User data
- App content
- Shared data

**Patterns:**
- Load on mount
- Optimistic updates
- Real-time subscriptions (where needed)

---

## Deployment

### Frontend Deployment

**Build Process:**
```bash
npm run build
```

**Output:**
- Static files in `dist/`
- Optimized and minified
- Ready for CDN deployment

**Recommended Platforms:**
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront

**Environment Variables:**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### Backend Deployment

**Supabase (Managed):**
- Database: Automatically managed
- Auth: Automatically managed
- Edge Functions: Deploy via Supabase CLI or API

**Database Migrations:**
```bash
# Migrations are in supabase/migrations/
# Applied automatically in Supabase dashboard
```

**Edge Functions:**
```bash
# Deploy using Supabase MCP tools or CLI
supabase functions deploy function-name
```

### CI/CD Pipeline Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist
```

---

## Performance Optimizations

### Frontend Optimizations

1. **Code Splitting**
   - Lazy loading routes
   - Dynamic imports for heavy components

2. **Asset Optimization**
   - Image optimization
   - CSS minification
   - Tree shaking

3. **Caching**
   - Service worker caching
   - Browser cache headers
   - API response caching

### Database Optimizations

1. **Indexes**
   ```sql
   CREATE INDEX idx_todos_user_id ON todos(user_id);
   CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
   ```

2. **Query Optimization**
   - Select only needed columns
   - Use pagination for large datasets
   - Avoid N+1 queries

3. **Connection Pooling**
   - Managed by Supabase
   - Automatic scaling

---

## Monitoring and Logging

### Frontend Monitoring
- Console errors
- Network failures
- Performance metrics

### Backend Monitoring
- Supabase dashboard
- Edge function logs
- Database query performance

### Error Handling

```typescript
try {
  const { data, error } = await supabase
    .from('todos')
    .select('*');

  if (error) throw error;

  return data;
} catch (error) {
  console.error('Error fetching todos:', error);
  // Show user-friendly error message
  // Log to error tracking service
}
```

---

## Future Architecture Considerations

### Scalability
- Implement caching layer (Redis)
- Add CDN for static assets
- Consider database read replicas
- Implement rate limiting

### Features
- WebSocket for real-time collaboration
- Background job processing
- File upload and storage
- Mobile app (React Native)

### DevOps
- Automated testing
- Staging environment
- Feature flags
- A/B testing framework

---

## Conclusion

The Platform's architecture is designed to be:
- **Modular** - Easy to add new features
- **Secure** - Multiple layers of security
- **Scalable** - Ready to grow with users
- **Maintainable** - Clean code and clear patterns
- **Modern** - Using latest best practices

For questions or suggestions, please refer to the main README.md or open an issue.
