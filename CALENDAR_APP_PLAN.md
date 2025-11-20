# Calendar & Meeting Scheduler - Implementation Plan

## Overview
A comprehensive calendar and meeting scheduling application with third-party integrations for Google Calendar and Microsoft Outlook.

## Phase 1: Core Calendar Functionality (MVP)

### Database Schema
1. **events table**
   - id (uuid, primary key)
   - user_id (uuid, foreign key to auth.users)
   - title (text)
   - description (text, nullable)
   - start_time (timestamptz)
   - end_time (timestamptz)
   - location (text, nullable)
   - event_type (text: 'meeting', 'task', 'reminder', 'other')
   - color (text, for visual categorization)
   - is_all_day (boolean)
   - recurrence_rule (text, nullable - for recurring events)
   - created_at (timestamptz)
   - updated_at (timestamptz)

2. **event_participants table**
   - id (uuid, primary key)
   - event_id (uuid, foreign key to events)
   - email (text)
   - name (text, nullable)
   - status (text: 'pending', 'accepted', 'declined', 'tentative')
   - created_at (timestamptz)

3. **availability_settings table**
   - id (uuid, primary key)
   - user_id (uuid, foreign key to auth.users)
   - day_of_week (integer, 0-6)
   - start_time (time)
   - end_time (time)
   - is_available (boolean)

4. **external_calendar_connections table**
   - id (uuid, primary key)
   - user_id (uuid, foreign key to auth.users)
   - provider (text: 'google', 'outlook')
   - access_token (text, encrypted)
   - refresh_token (text, encrypted)
   - token_expiry (timestamptz)
   - calendar_id (text, external calendar identifier)
   - last_sync (timestamptz)
   - created_at (timestamptz)

### UI Components

#### Calendar Views
1. **Month View**
   - Grid layout showing full month
   - Mini calendar date cells
   - Event indicators on dates
   - Navigate between months

2. **Week View**
   - 7-day horizontal layout
   - Hourly time slots
   - Drag-and-drop event creation
   - Multi-day event support

3. **Day View**
   - Single day detailed view
   - 30-minute time slots
   - Hour markers
   - Current time indicator

4. **Agenda View**
   - List of upcoming events
   - Grouped by date
   - Quick actions for each event

#### Event Management
1. **Create Event Modal**
   - Title, description inputs
   - Date/time pickers
   - Duration selector
   - Location input
   - Event type selector
   - Color picker
   - Participant email input (multi)
   - Recurrence options
   - Save/Cancel actions

2. **Event Detail Modal**
   - Full event information display
   - Edit button
   - Delete button
   - Participant list with statuses
   - Copy event link
   - Add to external calendar option

3. **Quick Event Creation**
   - Click on time slot to create
   - Inline title input
   - Default 1-hour duration
   - Expand for more options

#### Meeting Scheduler
1. **Availability Page**
   - Weekly schedule grid
   - Toggle available/unavailable time blocks
   - Set working hours
   - Buffer time between meetings
   - Save settings

2. **Booking Page**
   - Shareable URL generation
   - Available time slots display
   - Select date and time
   - Fill participant information
   - Confirmation and calendar invitation

## Phase 2: Third-Party Integrations

### Google Calendar Integration

#### OAuth Setup
1. **Edge Function: google-oauth-callback**
   - Handle OAuth authorization code
   - Exchange for access and refresh tokens
   - Store encrypted tokens in database
   - Return success/error to frontend

2. **Edge Function: google-calendar-sync**
   - Fetch events from Google Calendar
   - Sync to local database
   - Handle incremental updates
   - Two-way sync (create events in Google)

#### Features
- Import events from Google Calendar
- Export events to Google Calendar
- Real-time sync with webhooks
- Conflict detection and resolution
- Meeting room suggestions (if available)

### Microsoft Outlook Integration

#### OAuth Setup
1. **Edge Function: outlook-oauth-callback**
   - Microsoft identity platform OAuth
   - Token exchange and storage
   - Handle refresh token flow

2. **Edge Function: outlook-calendar-sync**
   - Microsoft Graph API integration
   - Event synchronization
   - Attendee status updates

#### Features
- Import/export Outlook events
- Teams meeting link generation
- Outlook availability sync
- Email notifications via Outlook

## Phase 3: Advanced Features

### Smart Scheduling
- Find meeting times that work for all participants
- Suggest optimal meeting times based on:
  - Participant availability
  - Time zones
  - Working hours preferences
  - Meeting history patterns

### Notifications
- Email reminders (via Supabase Edge Functions)
- In-app notifications
- Configurable reminder times (5min, 15min, 30min, 1hr, 1day before)

### Time Zone Support
- Display events in user's local timezone
- Show participant timezones
- Timezone converter tool
- Schedule across timezones

### Recurring Events
- Daily, weekly, monthly, yearly patterns
- Custom recurrence rules
- Edit single occurrence or series
- Exception handling (skip specific dates)

### Event Search & Filtering
- Full-text search
- Filter by date range
- Filter by event type
- Filter by participant
- Filter by calendar source

## Phase 4: Collaboration Features

### Team Calendars
- Create shared team calendars
- Permission levels (view, edit, admin)
- Team availability view
- Resource booking (rooms, equipment)

### Meeting Templates
- Save common meeting configurations
- Quick create from template
- Default participants, duration, location

### Meeting Notes & Actions
- Integrated note-taking
- Action items tracking
- Link to external notes (Notion, Google Docs)

## Technical Implementation Details

### Frontend Architecture
- React with TypeScript
- Styled Components for styling
- Framer Motion for animations
- react-big-calendar or custom calendar component
- date-fns for date manipulation
- React Hook Form for form management

### State Management
- React hooks for local state
- Supabase real-time subscriptions for live updates
- Context for global calendar settings

### API Layer
- Supabase client for database operations
- Edge Functions for external API calls
- Caching strategy for performance
- Optimistic UI updates

### Security Considerations
- RLS policies for all database tables
- Encrypted storage for OAuth tokens
- HTTPS only for external API calls
- Rate limiting on Edge Functions
- Input validation and sanitization

### Performance Optimization
- Lazy loading for event data
- Virtual scrolling for large event lists
- Debounced search
- Cached external calendar data
- Background sync with service workers

## Implementation Timeline

### Week 1-2: MVP Core Calendar
- Database setup and migrations
- Basic month/week/day views
- Create/edit/delete events
- Simple event list

### Week 3: Event Management
- Advanced event creation
- Recurrence support
- Participant management
- Event colors and categories

### Week 4: Meeting Scheduler
- Availability settings
- Booking page
- Shareable links
- Email confirmations

### Week 5-6: Google Calendar Integration
- OAuth flow implementation
- Event sync (both directions)
- Conflict resolution
- Testing and refinement

### Week 7-8: Outlook Integration
- Microsoft OAuth setup
- Graph API integration
- Teams meeting support
- Testing

### Week 9-10: Polish & Advanced Features
- Notifications system
- Search and filtering
- Time zone support
- UI/UX improvements
- Performance optimization
- Bug fixes

## Dependencies

### npm Packages
- `react-big-calendar` or `@fullcalendar/react` - Calendar component
- `date-fns` - Date manipulation
- `react-hook-form` - Form management
- `zod` - Schema validation
- `rrule` - Recurrence rule handling

### External APIs
- Google Calendar API
- Microsoft Graph API
- SendGrid or similar for email notifications (optional)

## MVP Scope (Start Here)
To get started quickly, implement:
1. Database schema for events
2. Basic calendar month view
3. Create/edit/delete events
4. Simple event list view
5. No external integrations initially

Then incrementally add:
- Week/day views
- Meeting scheduler
- Google Calendar integration
- Outlook integration
- Advanced features

## Notes
- OAuth implementations require careful security handling
- External calendar sync should be done via Edge Functions to protect API keys
- Consider rate limits for external APIs
- Build offline-first with sync capability
- Test thoroughly with different timezones
- Implement proper error handling for network issues
