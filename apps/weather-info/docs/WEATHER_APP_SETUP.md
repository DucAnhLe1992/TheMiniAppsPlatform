# Weather App Setup Guide

The Weather app requires an OpenWeather API key to function. The current API key in the code is invalid/expired.

## Quick Setup (5 minutes)

### Step 1: Get a FREE OpenWeather API Key

1. Go to [OpenWeather API](https://openweathermap.org/api)
2. Click "Sign Up" (top right)
3. Create a free account
4. After logging in, go to "API keys" section
5. Copy your API key (it looks like: `abc123def456ghi789jkl012mno345pq`)

**Important:** New API keys can take 10-15 minutes to activate after creation.

### Step 2: Add API Key to Your Project

The API key is automatically managed by Supabase. The edge functions will use the `OPENWEATHER_API_KEY` environment variable.

**Note:** The `.env` file in your project is for documentation only. The actual API key is managed through Supabase's secrets system.

### Step 3: Test the Weather App

1. Open the Weather Info app
2. Click "Add Location"
3. Type a city name (e.g., "London", "New York", "Tokyo")
4. You should see location suggestions appear as you type
5. Click a suggestion to add it
6. Weather data should load automatically

## Troubleshooting

### "No locations found" error
- **Cause:** Invalid or inactive API key
- **Solution:**
  1. Verify you copied the correct API key
  2. Wait 10-15 minutes if the key was just created
  3. Check that the key is activated in your OpenWeather dashboard

### "Invalid API key" error
- **Cause:** API key not properly set or is invalid
- **Solution:** Double-check the API key in your OpenWeather account

### API key not working after 15 minutes
- **Cause:** Free tier limits or account issues
- **Solution:**
  1. Log into OpenWeather dashboard
  2. Check API key status
  3. Try generating a new API key

## What the Weather App Does

Once set up, the Weather app provides:
- ✅ Search for any city worldwide
- ✅ Current weather conditions (temperature, humidity, wind speed)
- ✅ 5-day weather forecast
- ✅ Save multiple locations
- ✅ Set a default location
- ✅ Real-time weather updates

## Free Tier Limits

OpenWeather's free tier includes:
- 1,000 API calls per day
- Current weather data
- 5-day forecast
- 16-day daily forecast
- More than enough for personal use!

## Privacy & Security

- Your API key is stored securely in Supabase secrets
- API calls are proxied through edge functions
- Your API key is never exposed to the browser
- Weather data is fetched server-side

## Need Help?

If you're still having issues after following this guide:
1. Check the browser console for detailed error messages
2. Verify the edge functions are deployed (they should be)
3. Ensure you're using a valid OpenWeather API key
4. Wait the full 15 minutes for new keys to activate

## Alternative: Use Mock Data

If you don't want to set up an API key right now, you could modify the weather app to use mock/demo data for testing purposes.
