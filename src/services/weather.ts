import type { WeatherData } from "@/types";

// Open-Meteo is completely free, no API key needed
// WMO weather code to description mapping
const weatherDescriptions: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Foggy", icon: "🌫️" },
  48: { description: "Icy fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Drizzle", icon: "🌦️" },
  55: { description: "Heavy drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌧️" },
  63: { description: "Rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  71: { description: "Slight snow", icon: "🌨️" },
  73: { description: "Snow", icon: "❄️" },
  75: { description: "Heavy snow", icon: "❄️" },
  80: { description: "Rain showers", icon: "🌦️" },
  81: { description: "Rain showers", icon: "🌦️" },
  82: { description: "Heavy rain showers", icon: "⛈️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" },
};

export async function getWeather(
  latitude: number,
  longitude: number,
  city: string
): Promise<WeatherData> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude.toString());
  url.searchParams.set("longitude", longitude.toString());
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code"
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString(), { next: { revalidate: 1800 } });

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();
  const current = data.current;
  const weatherCode: number = current.weather_code ?? 0;
  const weatherInfo = weatherDescriptions[weatherCode] ?? {
    description: "Unknown",
    icon: "🌡️",
  };

  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    description: weatherInfo.description,
    city,
    icon: weatherInfo.icon,
  };
}
