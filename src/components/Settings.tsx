import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';
import { Globe, Server } from 'lucide-react';

export const Settings: React.FC = () => {
  const { apiMode, setApiMode, isDirectMode, isBackendMode } = useSettings();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">API Settings</CardTitle>
        <CardDescription>
          Choose how to fetch weather data:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Direct API Option */}
          <div
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              isDirectMode()
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => setApiMode('direct')}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-full ${
                  isDirectMode()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Globe className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Direct API</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Calls Open-Meteo API directly from the browser
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isDirectMode()
                    ? 'border-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isDirectMode() && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </div>

          {/* Backend API Option */}
          <div
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              isBackendMode()
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => setApiMode('backend')}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-full ${
                  isBackendMode()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Server className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Java Backend</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Uses your Java Spring Boot backend service
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isBackendMode()
                    ? 'border-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isBackendMode() && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Mode Indicator */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current mode:
          </span>
          <Badge
            variant={isDirectMode() ? 'default' : 'secondary'}
            className={isDirectMode() ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
          >
            {isDirectMode() ? 'Direct API' : 'Java Backend'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
