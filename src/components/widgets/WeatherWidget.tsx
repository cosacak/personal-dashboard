"use client";

import { useEffect, useState } from "react";
import type { WeatherData } from "@/types";

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setWeather(data);
      } catch {
        setError("Could not load weather");
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white animate-pulse">
        <div className="h-8 bg-blue-400 rounded w-1/2 mb-4" />
        <div className="h-16 bg-blue-400 rounded w-1/3 mb-2" />
        <div className="h-4 bg-blue-400 rounded w-2/3" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl p-6 text-white">
        <p className="text-sm opacity-75">Weather unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{weather.city}</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-5xl font-bold">{weather.temperature}°</span>
            <span className="text-2xl mb-2">{weather.icon}</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{weather.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5 border-t border-blue-400 pt-4">
        <div className="text-center">
          <p className="text-xs opacity-70">Feels like</p>
          <p className="font-semibold">{weather.feelsLike}°</p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-70">Humidity</p>
          <p className="font-semibold">{weather.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-70">Wind</p>
          <p className="font-semibold">{weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
}
