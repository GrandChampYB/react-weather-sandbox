import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  time: string;
  temperature: number;
  weatherCode: number;
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
}

interface WeatherResponse {
  hourly: WeatherData[];
  daily: WeatherData[];
}

// Simple zip code to coordinates conversion using a free service
const getCoordinatesFromZip = async (zipCode: string) => {
  try {
    // Using Nominatim (OpenStreetMap) geocoding service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${zipCode}&countrycodes=us&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name
      };
    }
    throw new Error("Location not found");
  } catch (error) {
    throw new Error("Failed to get coordinates from zip code");
  }
};

const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const baseUrl = "https://api.open-meteo.com/v1/forecast";
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation",
    daily: "temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum",
    timezone: "auto",
    forecast_days: "7"
  });

  const response = await fetch(`${baseUrl}?${params}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  // Process hourly data (next 24 hours)
  const hourlyData: WeatherData[] = data.hourly.time
    .slice(0, 24)
    .map((time: string, index: number) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      weatherCode: data.hourly.weather_code[index],
      humidity: data.hourly.relative_humidity_2m[index],
      windSpeed: data.hourly.wind_speed_10m[index],
      precipitation: data.hourly.precipitation[index]
    }));

  // Process daily data (next 7 days)
  const dailyData: WeatherData[] = data.daily.time.map((time: string, index: number) => ({
    time,
    temperature: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
    weatherCode: data.daily.weather_code[index],
    windSpeed: data.daily.wind_speed_10m_max[index],
    precipitation: data.daily.precipitation_sum[index]
  }));

  return { hourly: hourlyData, daily: dailyData };
};

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>("");
  const { toast } = useToast();

  const fetchWeather = async (zipCode: string) => {
    if (!zipCode.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid zip code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const coordinates = await getCoordinatesFromZip(zipCode.trim());
      setLocation(coordinates.name);
      
      const weather = await fetchWeatherData(coordinates.lat, coordinates.lon);
      setWeatherData(weather);
      
      toast({
        title: "Weather Updated",
        description: `Weather data loaded for ${coordinates.name}`
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    weatherData,
    isLoading,
    location,
    fetchWeather
  };
};