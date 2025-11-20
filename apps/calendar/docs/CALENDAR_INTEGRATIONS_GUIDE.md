# Calendar Integrations Guide

This guide explains how to implement the remaining advanced calendar features that require external service configuration.

## Features Already Implemented ✅

1. **Multiple Calendar Views**
   - Month view with full calendar grid
   - Week view with hourly time slots
   - Day view with detailed daily schedule
   - Agenda view with upcoming events list

2. **Advanced Event Management**
   - Event creation, editing, and deletion
   - Recurring events (Daily, Weekly, Monthly, Yearly)
   - All-day events support
   - Event colors and categories
   - Event search and filtering by type
   - Rich event details (title, description, location)

3. **Participants & Collaboration**
   - Add multiple participants to events
   - Participant status tracking (pending, accepted, declined, tentative)
   - Email-based participant management

4. **Reminders**
   - Configurable reminder times (5min, 15min, 30min, 1hr, 1 day before)
   - Database support for reminder notifications

## Remaining Features (Require External Setup)

### 1. Google Calendar Integration

**Requirements:**
- Google Cloud Console project
- OAuth 2.0 credentials
- Google Calendar API enabled

**Implementation Steps:**

#### Step 1: Set up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

#### Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name
   - User support email
   - Developer contact email
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`

#### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/google/callback`
   - For local development: `http://localhost:3000/api/auth/google/callback`
5. Save Client ID and Client Secret

#### Step 4: Create Edge Function for Google OAuth

Create `supabase/functions/google-oauth-callback/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;
const REDIRECT_URI = Deno.env.get("GOOGLE_REDIRECT_URI")!;

serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenResponse.json();

  // Store tokens in database
  const { data: { user } } = await supabase.auth.getUser(
    req.headers.get("Authorization")?.replace("Bearer ", "")
  );

  await supabase.from("external_calendar_connections").upsert({
    user_id: user.id,
    provider: "google",
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    calendar_id: "primary",
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

#### Step 5: Create Edge Function for Google Calendar Sync

Create `supabase/functions/sync-google-calendar/index.ts`:

```typescript
// Fetch events from Google Calendar
const response = await fetch(
  `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
  {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }
);

const googleEvents = await response.json();

// Convert and store in local database
for (const event of googleEvents.items) {
  await supabase.from("events").upsert({
    title: event.summary,
    description: event.description,
    start_time: event.start.dateTime || event.start.date,
    end_time: event.end.dateTime || event.end.date,
    location: event.location,
    color: "#4285f4",
    external_id: event.id,
    external_provider: "google",
  });
}
```

### 2. Microsoft Outlook Integration

**Requirements:**
- Microsoft Azure account
- Azure AD app registration
- Microsoft Graph API permissions

**Implementation Steps:**

#### Step 1: Register Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Configure:
   - Name: "Your App Calendar Integration"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: `https://your-domain.com/api/auth/outlook/callback`

#### Step 2: Configure API Permissions

1. Go to "API permissions"
2. Click "Add a permission" > "Microsoft Graph"
3. Add these permissions:
   - `Calendars.Read`
   - `Calendars.ReadWrite`
   - `User.Read`
4. Click "Grant admin consent"

#### Step 3: Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Copy the secret value (shown only once)

#### Step 4: Create Edge Function for Outlook OAuth

Similar to Google OAuth, create `supabase/functions/outlook-oauth-callback/index.ts` using Microsoft Identity Platform endpoints.

#### Step 5: Create Edge Function for Outlook Calendar Sync

Use Microsoft Graph API to sync events:

```typescript
// Fetch events from Outlook
const response = await fetch(
  `https://graph.microsoft.com/v1.0/me/calendar/events`,
  {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }
);
```

### 3. Email Notifications

**Requirements:**
- Email service provider (SendGrid, Resend, or similar)
- API key from provider

**Implementation Steps:**

#### Option A: Using SendGrid

1. Create account at [SendGrid](https://sendgrid.com/)
2. Verify sender email
3. Create API key
4. Store in Supabase secrets:
   ```bash
   supabase secrets set SENDGRID_API_KEY=your_api_key
   ```

#### Option B: Using Resend (Recommended)

1. Create account at [Resend](https://resend.com/)
2. Add and verify domain
3. Create API key
4. Store in Supabase secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your_api_key
   ```

#### Create Email Notification Edge Function

Create `supabase/functions/send-event-reminder/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

serve(async (req) => {
  const { eventId } = await req.json();

  // Fetch event details
  const { data: event } = await supabase
    .from("events")
    .select("*, event_participants(*)")
    .eq("id", eventId)
    .single();

  // Send email to each participant
  for (const participant of event.event_participants) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "calendar@yourdomain.com",
        to: participant.email,
        subject: `Reminder: ${event.title}`,
        html: `
          <h2>Event Reminder</h2>
          <p><strong>${event.title}</strong></p>
          <p>When: ${new Date(event.start_time).toLocaleString()}</p>
          ${event.location ? `<p>Where: ${event.location}</p>` : ""}
          ${event.description ? `<p>${event.description}</p>` : ""}
        `,
      }),
    });
  }

  return new Response(JSON.stringify({ success: true }));
});
```

#### Set up Scheduled Reminders

Create a Supabase Database Webhook or use pg_cron:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule reminder check every minute
SELECT cron.schedule(
  'send-event-reminders',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/send-event-reminder',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
    body := json_build_object('eventId', id)::text
  )
  FROM events
  WHERE start_time - (reminder_minutes || ' minutes')::interval <= NOW()
    AND start_time > NOW()
    AND reminder_sent = false;
  $$
);
```

### 4. Meeting Scheduler / Availability Booking

The database schema is already set up. To implement:

1. Create a booking page component
2. Allow users to set their availability hours
3. Generate shareable booking links
4. Display available time slots to invitees

**Example booking flow:**

```typescript
// Fetch user availability
const { data: availability } = await supabase
  .from("availability_settings")
  .select("*")
  .eq("user_id", userId);

// Check existing events for conflicts
const { data: events } = await supabase
  .from("events")
  .select("*")
  .gte("start_time", startDate)
  .lte("end_time", endDate);

// Calculate available slots
const availableSlots = calculateAvailableSlots(availability, events);
```

## Environment Variables Needed

Add these to your `.env` file:

```bash
# Google Calendar
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri

# Microsoft Outlook
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_REDIRECT_URI=your_redirect_uri

# Email Service (choose one)
SENDGRID_API_KEY=your_api_key
# OR
RESEND_API_KEY=your_api_key
```

## Testing Integrations

1. **Google Calendar**: Use Google's OAuth 2.0 Playground to test token exchange
2. **Outlook**: Use Microsoft Graph Explorer to test API calls
3. **Email**: Use provider's testing endpoints before production

## Security Notes

- Always store tokens encrypted in database
- Implement token refresh logic for expired tokens
- Use HTTPS for all OAuth redirects
- Validate all webhook signatures
- Rate limit external API calls
- Log all integration errors for debugging

## Next Steps

1. Choose which integrations you want to implement
2. Set up accounts with required services
3. Deploy edge functions
4. Test OAuth flows in development
5. Add UI components for connecting accounts
6. Implement sync logic
7. Set up monitoring and error handling

For questions or issues, refer to:
- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/api/resources/calendar)
- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)
