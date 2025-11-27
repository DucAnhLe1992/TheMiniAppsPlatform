export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
}

export interface LocationSuggestion {
  name: string;
  city: string;
  country: string;
  state: string | null;
  latitude: number;
  longitude: number;
  display: string;
}

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}
