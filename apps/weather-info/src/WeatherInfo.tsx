import React, { useState, useEffect } from "react";
import { supabase, useTheme } from "@shared";
import { AnimatePresence } from "framer-motion";
import {
  Location,
  LocationSuggestion,
  WeatherData,
  ForecastDay,
} from "./types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  TopControls,
  Button,
  LocationTabs,
  LocationTab,
  WeatherCard,
  CurrentWeather,
  WeatherIcon,
  WeatherMain,
  LocationName,
  Temperature,
  WeatherDescription,
  WeatherDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  ForecastSection,
  SectionTitle,
  ForecastGrid,
  ForecastCard,
  ForecastDay as ForecastDayStyled,
  ForecastIcon,
  ForecastTemp,
  ForecastDesc,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  EmptyState,
  EmptyIcon,
  EmptyText,
  SuggestionsList,
  SuggestionItem,
  SuggestionName,
  SuggestionDetails,
  LoadingText,
  ErrorText,
} from "./styles";

// Supabase typing workaround for insert during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

/* Styled components and constants moved to styles.ts & types.ts */

const getWeatherIcon = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("thunder")) return "⛈️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  return "🌤️";
};

const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<WeatherData | null> => {
  try {
    const apiUrl = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/get-weather?lat=${lat}&lon=${lon}&type=current`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch weather");

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].description),
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: Array<{ description: string }>;
}

const fetchForecastData = async (
  lat: number,
  lon: number
): Promise<ForecastDay[]> => {
  try {
    const apiUrl = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/get-weather?lat=${lat}&lon=${lon}&type=forecast`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch forecast");

    const data = await response.json();

    const dailyData: { [key: string]: ForecastItem[] } = {};
    data.list.forEach((item: ForecastItem) => {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      if (!dailyData[dayName]) dailyData[dayName] = [];
      dailyData[dayName].push(item);
    });

    return Object.entries(dailyData)
      .slice(0, 5)
      .map(([day, items]) => {
        const temps = items.map((item: ForecastItem) => item.main.temp);
        const descriptions = items.map(
          (item: ForecastItem) => item.weather[0].description
        );
        return {
          date: day,
          temp_max: Math.round(Math.max(...temps)),
          temp_min: Math.round(Math.min(...temps)),
          description: descriptions[0],
          icon: getWeatherIcon(descriptions[0]),
        };
      });
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return [];
  }
};

const WeatherInfo: React.FC = () => {
  const { theme } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationCity, setNewLocationCity] = useState("");
  const [newLocationCountry, setNewLocationCountry] = useState("");
  const [newLocationLat, setNewLocationLat] = useState("");
  const [newLocationLon, setNewLocationLon] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    initUser();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchWeather(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (locationSearch.length >= 2) {
        searchLocations(locationSearch);
      } else {
        setLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [locationSearch]);

  const initUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await db
        .from("saved_locations")
        .select("*")
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      setLocations(data || []);

      if (data && data.length > 0) {
        const defaultLoc =
          data.find((loc: Location) => loc.is_default) || data[0];
        setSelectedLocation(defaultLoc);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchWeather = async (location: Location) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const weatherData = await fetchWeatherData(
        location.latitude,
        location.longitude
      );
      if (weatherData) {
        setWeather(weatherData);
      } else {
        throw new Error("Failed to fetch weather data");
      }

      const forecastData = await fetchForecastData(
        location.latitude,
        location.longitude
      );
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherError("Unable to fetch weather data. Please try again later.");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const apiUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/search-locations?q=${encodeURIComponent(query)}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) throw new Error("Failed to search locations");

      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error searching locations:", error);
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSearchChange = (value: string) => {
    setLocationSearch(value);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setNewLocationName(suggestion.name);
    setNewLocationCity(suggestion.city);
    setNewLocationCountry(suggestion.country);
    setNewLocationLat(suggestion.latitude.toString());
    setNewLocationLon(suggestion.longitude.toString());
    setLocationSearch(suggestion.display);
    setLocationSuggestions([]);
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newLocationName.trim() || !newLocationCity.trim()) return;

    try {
      const { error } = await db.from("saved_locations").insert({
        user_id: userId,
        name: newLocationName,
        city: newLocationCity,
        country: newLocationCountry || "Unknown",
        latitude: parseFloat(newLocationLat) || 0,
        longitude: parseFloat(newLocationLon) || 0,
        is_default: locations.length === 0,
      });

      if (error) throw error;

      await fetchLocations();
      setShowLocationModal(false);
      setNewLocationName("");
      setNewLocationCity("");
      setNewLocationCountry("");
      setNewLocationLat("");
      setNewLocationLon("");
      setLocationSearch("");
      setLocationSuggestions([]);
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm("Delete this location?")) return;

    try {
      const { error } = await supabase
        .from("saved_locations")
        .delete()
        .eq("id", locationId);

      if (error) throw error;

      if (selectedLocation?.id === locationId) {
        setSelectedLocation(null);
        setWeather(null);
      }

      await fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  if (locations.length === 0) {
    return (
      <Container>
        <Header>
          <Title theme={theme}>Weather & Local Info</Title>
          <Subtitle theme={theme}>
            Check weather conditions for your locations
          </Subtitle>
        </Header>

        <EmptyState>
          <EmptyIcon>🌤️</EmptyIcon>
          <EmptyText theme={theme}>
            No saved locations yet. Add your first location to see weather!
          </EmptyText>
          <Button
            theme={theme}
            $variant="primary"
            onClick={() => setShowLocationModal(true)}
          >
            + Add Location
          </Button>
        </EmptyState>

        <AnimatePresence>
          {showLocationModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
            >
              <ModalContent
                theme={theme}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle theme={theme}>Add Location</ModalTitle>
                  <CloseButton
                    theme={theme}
                    onClick={() => setShowLocationModal(false)}
                  >
                    ✕
                  </CloseButton>
                </ModalHeader>

                <Form onSubmit={handleAddLocation}>
                  <FormGroup style={{ position: "relative" }}>
                    <Label theme={theme}>Search Location *</Label>
                    <Input
                      theme={theme}
                      type="text"
                      value={locationSearch}
                      onChange={(e) =>
                        handleLocationSearchChange(e.target.value)
                      }
                      placeholder="Type a city name... e.g., New York, London, Tokyo"
                      autoComplete="off"
                    />
                    {isSearching && (
                      <LoadingText theme={theme}>Searching...</LoadingText>
                    )}
                    {!isSearching &&
                      locationSearch.length >= 2 &&
                      locationSuggestions.length === 0 && (
                        <ErrorText theme={theme}>
                          No locations found. Try a different search term.
                        </ErrorText>
                      )}
                    {locationSuggestions.length > 0 && (
                      <SuggestionsList theme={theme}>
                        {locationSuggestions.map((suggestion, index) => (
                          <SuggestionItem
                            key={index}
                            theme={theme}
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            <SuggestionName theme={theme}>
                              {suggestion.name}
                            </SuggestionName>
                            <SuggestionDetails theme={theme}>
                              {suggestion.state && `${suggestion.state}, `}
                              {suggestion.country}
                            </SuggestionDetails>
                          </SuggestionItem>
                        ))}
                      </SuggestionsList>
                    )}
                  </FormGroup>

                  {newLocationCity && (
                    <>
                      <FormGroup>
                        <Label theme={theme}>Location Name *</Label>
                        <Input
                          theme={theme}
                          type="text"
                          value={newLocationName}
                          onChange={(e) => setNewLocationName(e.target.value)}
                          placeholder="e.g., Home, Work, Office"
                          required
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label theme={theme}>Selected Location</Label>
                        <Input
                          theme={theme}
                          type="text"
                          value={`${newLocationCity}, ${newLocationCountry}`}
                          readOnly
                          disabled
                        />
                      </FormGroup>
                    </>
                  )}

                  <ButtonGroup>
                    <Button
                      theme={theme}
                      type="button"
                      $variant="secondary"
                      onClick={() => setShowLocationModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button theme={theme} type="submit" $variant="primary">
                      Add Location
                    </Button>
                  </ButtonGroup>
                </Form>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title theme={theme}>Weather & Local Info</Title>
        <Subtitle theme={theme}>
          Check weather conditions for your locations
        </Subtitle>
      </Header>

      <TopControls>
        <Button
          theme={theme}
          $variant="primary"
          onClick={() => setShowLocationModal(true)}
        >
          + Add Location
        </Button>
      </TopControls>

      <LocationTabs>
        {locations.map((location) => (
          <LocationTab
            key={location.id}
            theme={theme}
            $active={selectedLocation?.id === location.id}
            onClick={() => setSelectedLocation(location)}
          >
            {location.name}
          </LocationTab>
        ))}
      </LocationTabs>

      {isLoadingWeather && selectedLocation && (
        <WeatherCard theme={theme}>
          <LoadingText theme={theme}>Loading weather data...</LoadingText>
        </WeatherCard>
      )}

      {weatherError && selectedLocation && (
        <WeatherCard theme={theme}>
          <ErrorText theme={theme}>{weatherError}</ErrorText>
          <ButtonGroup style={{ justifyContent: "center", marginTop: "1rem" }}>
            <Button
              theme={theme}
              $variant="primary"
              onClick={() => fetchWeather(selectedLocation)}
            >
              Retry
            </Button>
          </ButtonGroup>
        </WeatherCard>
      )}

      {weather && selectedLocation && !isLoadingWeather && !weatherError && (
        <WeatherCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CurrentWeather>
            <WeatherIcon>{weather.icon}</WeatherIcon>
            <WeatherMain>
              <LocationName theme={theme}>
                {selectedLocation.city}, {selectedLocation.country}
              </LocationName>
              <Temperature theme={theme}>{weather.temp}°C</Temperature>
              <WeatherDescription theme={theme}>
                {weather.description}
              </WeatherDescription>
            </WeatherMain>
          </CurrentWeather>

          <WeatherDetails theme={theme}>
            <DetailItem>
              <DetailLabel theme={theme}>Feels Like</DetailLabel>
              <DetailValue theme={theme}>{weather.feels_like}°C</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel theme={theme}>Humidity</DetailLabel>
              <DetailValue theme={theme}>{weather.humidity}%</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel theme={theme}>Wind Speed</DetailLabel>
              <DetailValue theme={theme}>{weather.wind_speed} km/h</DetailValue>
            </DetailItem>
          </WeatherDetails>

          <ForecastSection>
            <SectionTitle theme={theme}>5-Day Forecast</SectionTitle>
            <ForecastGrid>
              {forecast.map((day, index) => (
                <ForecastCard key={index} theme={theme}>
                  <ForecastDayStyled theme={theme}>
                    {day.date}
                  </ForecastDayStyled>
                  <ForecastIcon>{day.icon}</ForecastIcon>
                  <ForecastTemp theme={theme}>
                    {day.temp_max}° / {day.temp_min}°
                  </ForecastTemp>
                  <ForecastDesc theme={theme}>{day.description}</ForecastDesc>
                </ForecastCard>
              ))}
            </ForecastGrid>
          </ForecastSection>

          <ButtonGroup style={{ marginTop: "2rem" }}>
            <Button
              theme={theme}
              $variant="secondary"
              onClick={() => handleDeleteLocation(selectedLocation.id)}
            >
              🗑️ Delete Location
            </Button>
          </ButtonGroup>
        </WeatherCard>
      )}

      <AnimatePresence>
        {showLocationModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLocationModal(false)}
          >
            <ModalContent
              theme={theme}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle theme={theme}>Add Location</ModalTitle>
                <CloseButton
                  theme={theme}
                  onClick={() => setShowLocationModal(false)}
                >
                  ✕
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleAddLocation}>
                <FormGroup style={{ position: "relative" }}>
                  <Label theme={theme}>Search Location *</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={locationSearch}
                    onChange={(e) => handleLocationSearchChange(e.target.value)}
                    placeholder="Type a city name... e.g., New York, London, Tokyo"
                    autoComplete="off"
                  />
                  {isSearching && (
                    <LoadingText theme={theme}>Searching...</LoadingText>
                  )}
                  {!isSearching &&
                    locationSearch.length >= 2 &&
                    locationSuggestions.length === 0 && (
                      <ErrorText theme={theme}>
                        No locations found. Try a different search term.
                      </ErrorText>
                    )}
                  {locationSuggestions.length > 0 && (
                    <SuggestionsList theme={theme}>
                      {locationSuggestions.map((suggestion, index) => (
                        <SuggestionItem
                          key={index}
                          theme={theme}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <SuggestionName theme={theme}>
                            {suggestion.name}
                          </SuggestionName>
                          <SuggestionDetails theme={theme}>
                            {suggestion.state && `${suggestion.state}, `}
                            {suggestion.country}
                          </SuggestionDetails>
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                </FormGroup>

                {newLocationCity && (
                  <>
                    <FormGroup>
                      <Label theme={theme}>Location Name *</Label>
                      <Input
                        theme={theme}
                        type="text"
                        value={newLocationName}
                        onChange={(e) => setNewLocationName(e.target.value)}
                        placeholder="e.g., Home, Work, Office"
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label theme={theme}>Selected Location</Label>
                      <Input
                        theme={theme}
                        type="text"
                        value={`${newLocationCity}, ${newLocationCountry}`}
                        readOnly
                        disabled
                      />
                    </FormGroup>
                  </>
                )}

                <ButtonGroup>
                  <Button
                    theme={theme}
                    type="button"
                    $variant="secondary"
                    onClick={() => setShowLocationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button theme={theme} type="submit" $variant="primary">
                    Add Location
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default WeatherInfo;
