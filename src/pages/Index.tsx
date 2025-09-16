import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherPanel } from "@/components/WeatherPanel";
import { Settings } from "@/components/Settings";
import { useWeatherData } from "@/hooks/useWeatherData";
import { MapPin, Search } from "lucide-react";

const Index = () => {
  const [zipCode, setZipCode] = useState("");
  const { weatherData, isLoading, location, fetchWeather } = useWeatherData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(zipCode);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <p className="text-muted-foreground">Get detailed weather information for any US zip code</p>
        </div>

        {/* Settings Component */}
        <Settings />

        {/* Search Form */}
        <Card className="weather-panel mb-8 max-w-md mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg">Enter Zip Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="12345"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="flex-1"
                pattern="[0-9]{5}"
                maxLength={5}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="weather-gradient hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </form>
            {location && (
              <div className="flex items-center justify-center gap-1 mt-3 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weather Panels */}
        {(weatherData || isLoading) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherPanel
              title="24-Hour Forecast"
              data={weatherData?.hourly || []}
              type="hourly"
              isLoading={isLoading}
            />
            <WeatherPanel
              title="7-Day Forecast"
              data={weatherData?.daily || []}
              type="daily"
              isLoading={isLoading}
            />
          </div>
        )}

        {!weatherData && !isLoading && (
          <div className="text-center py-12">
            <div className="weather-gradient w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search size={32} className="text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready for Weather</h3>
            <p className="text-muted-foreground">Enter a zip code above to get started with your weather forecast</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
