import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherCard } from "./WeatherCard";

interface WeatherData {
  time: string;
  temperature: number;
  weatherCode: number;
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
}

interface WeatherPanelProps {
  title: string;
  data: WeatherData[];
  type: "hourly" | "daily";
  isLoading?: boolean;
}

export const WeatherPanel = ({ title, data, type, isLoading }: WeatherPanelProps) => {
  return (
    <Card className="weather-panel h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          {title}
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-4">
          {isLoading ? (
            <div className="space-y-3 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-20 w-full"></div>
                </div>
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="pb-4">
              {data.map((item, index) => (
                <WeatherCard key={index} data={item} type={type} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No weather data available</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};