import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import axios from "axios";

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

// Direct API geocoding function
const getCoordinatesFromZipDirect = async (zipCode: string) => {
  try {
    // Using Nominatim (OpenStreetMap) geocoding service
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${zipCode}&countrycodes=us&limit=1`
    );
    const data = response.data;
    
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

// Backend API geocoding function
const getCoordinatesFromZipBackend = async (zipCode: string) => {
  try {
    const response = await axios.get(`http://localhost:8081/api/weather/geocode/${zipCode}`);
    const data = response.data;
    
    return {
      lat: data.lat,
      lon: data.lon,
      name: data.locationName || `${zipCode}`
    };
  } catch (error) {
    throw new Error("Failed to get coordinates from backend");
  }
};

// Direct API weather data fetch
const fetchWeatherDataDirect = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const baseUrl = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation",
    daily: "temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum",
    timezone: "auto",
    forecast_days: "7"
  };

  const response = await axios.get(baseUrl, { params });
  const data = response.data;

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

// Backend API weather data fetch
const fetchWeatherDataBackend = async (lat: number, lon: number): Promise<WeatherResponse> => {
  try {
    const response = await axios.get(`http://localhost:8081/api/weather/coordinates`, {
      params: { latitude: lat, longitude: lon }
    });
    const data = response.data;
    
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
  } catch (error) {
    throw new Error("Failed to fetch weather data from backend");
  }
};

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>("");
  const { toast } = useToast();
  const { isDirectMode, isBackendMode } = useSettings();

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
      if (isBackendMode()) {
        // Use backend's combined endpoint for zip code to weather data
        await fetchWeatherByZipBackend(zipCode.trim());
      } else {
        // Use direct API approach
        const coordinates = await getCoordinatesFromZipDirect(zipCode.trim());
        setLocation(coordinates.name);
        
        const weather = await fetchWeatherDataDirect(coordinates.lat, coordinates.lon);
        setWeatherData(weather);
        
        toast({
          title: "Weather Updated",
          description: `Weather data loaded for ${coordinates.name}`
        });
      }
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

  // Backend method for fetching weather by zip code (single API call)
  const fetchWeatherByZipBackend = async (zipCode: string) => {
    try {
      const url = `http://localhost:8081/api/weather/zip/${zipCode}`;
      console.log('React: Calling backend URL:', url);
      const response = await axios.get(url);
      console.log('React: Backend response:', response.data);
      const data = response.data;
      
      // Set location from the response or use zip code as fallback
      setLocation(`${zipCode}`);
      
      // Process hourly data (next 24 hours) - Backend returns raw Open-Meteo format
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

      // Process daily data (next 7 days) - Backend returns raw Open-Meteo format
      const dailyData: WeatherData[] = data.daily.time.map((time: string, index: number) => ({
        time,
        temperature: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
        weatherCode: data.daily.weather_code[index],
        windSpeed: 0, // Daily doesn't include wind speed in Open-Meteo
        precipitation: data.daily.precipitation_sum[index]
      }));

      setWeatherData({ hourly: hourlyData, daily: dailyData });
      
      toast({
        title: "Weather Updated",
        description: `Weather data loaded for ${zipCode}`
      });
    } catch (error) {
      console.error('React: Backend error:', error);
      throw new Error("Failed to fetch weather data from backend");
    }
  };

  return {
    weatherData,
    isLoading,
    location,
    fetchWeather
  };
};