import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY") || "25b18fa5cd964e22b69fa0c7e5c25dd7";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");
    const type = url.searchParams.get("type") || "current";

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: "Missing latitude or longitude parameters" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let apiUrl: string;
    if (type === "forecast") {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    }

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeather API Error:', response.status, errorText);
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid API key. Please set up your OpenWeather API key in Supabase secrets.",
            details: "Get a free API key at https://openweathermap.org/api"
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
      
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});