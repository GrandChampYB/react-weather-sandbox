import { Cloud, Sun, CloudRain, Snowflake, CloudSnow, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  time: string;
  temperature: number;
  weatherCode: number;
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
}

interface WeatherCardProps {
  data: WeatherData;
  type: "hourly" | "daily";
}

const getWeatherIcon = (code: number, size: number = 24) => {
  // WMO Weather interpretation codes
  if (code === 0) return <Sun size={size} className="text-accent" />;
  if (code <= 3) return <Cloud size={size} className="text-muted-foreground" />;
  if (code <= 67) return <CloudRain size={size} className="text-primary" />;
  if (code <= 77) return <CloudSnow size={size} className="text-blue-400" />;
  if (code <= 82) return <CloudRain size={size} className="text-primary" />;
  if (code <= 86) return <Snowflake size={size} className="text-blue-400" />;
  if (code <= 99) return <Zap size={size} className="text-yellow-500" />;
  
  return <Sun size={size} className="text-accent" />;
};

const getWeatherDescription = (code: number) => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Clear";
};

export const WeatherCard = ({ data, type }: WeatherCardProps) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    if (type === "hourly") {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="weather-panel mb-3 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(data.weatherCode, 32)}
            <div>
              <p className="font-medium text-foreground">{formatTime(data.time)}</p>
              <p className="text-sm text-muted-foreground">{getWeatherDescription(data.weatherCode)}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{Math.round(data.temperature)}°C</p>
            {data.humidity && (
              <p className="text-sm text-muted-foreground">Humidity: {data.humidity}%</p>
            )}
            {data.windSpeed && (
              <p className="text-sm text-muted-foreground">Wind: {Math.round(data.windSpeed)} km/h</p>
            )}
            {data.precipitation && data.precipitation > 0 && (
              <p className="text-sm text-primary">Rain: {data.precipitation}mm</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};