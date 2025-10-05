// Weather library for Skinster app using Open-Meteo API

interface CityCoords {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  elevation?: number;
  feature_code?: string;
  id: number;
  population?: number;
  timezone: string;
}

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: string;
    wind_speed_10m: string;
    uv_index: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    uv_index: number;
  };
}

interface WeatherResponse {
  success: boolean;
  location?: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  weather?: {
    temperature: number;
    temperature_unit: string;
    relative_humidity: number;
    relative_humidity_unit: string;
    apparent_temperature: number;
    apparent_temperature_unit: string;
    precipitation: number;
    precipitation_unit: string;
    weather_code: number;
    wind_speed: number;
    wind_speed_unit: string;
    uv_index: number;
    uv_index_unit: string;
    time: string;
  };
  error?: string;
}

// Step 1: Get coordinates from city name
async function getCityCoords(cityName: string): Promise<CityCoords | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results?.[0] || null; // {name, latitude, longitude, country, ...}
  } catch (error) {
    console.error("Error fetching city coordinates:", error);
    return null;
  }
}

// Weather parameters to fetch
const weatherInfos = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "uv_index",
];

// Step 2: Get weather with coordinates
async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: weatherInfos.join(","),
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

// Combined function to get weather by city name
export const weatherOperations = {
  // Get weather by city name
  getWeatherByCity: async (cityName: string): Promise<WeatherResponse> => {
    try {
      // Step 1: Get coordinates
      const cityCoords = await getCityCoords(cityName);

      if (!cityCoords) {
        return {
          success: false,
          error: "City not found. Please check the spelling and try again.",
        };
      }

      // Step 2: Get weather data
      const weatherData = await getWeather(
        cityCoords.latitude,
        cityCoords.longitude
      );

      if (!weatherData) {
        return {
          success: false,
          error: "Failed to fetch weather data. Please try again later.",
        };
      }

      return {
        success: true,
        location: {
          name: cityCoords.name,
          country: cityCoords.country,
          latitude: cityCoords.latitude,
          longitude: cityCoords.longitude,
        },
        weather: {
          temperature: weatherData.current.temperature_2m,
          temperature_unit: weatherData.current_units.temperature_2m,
          relative_humidity: weatherData.current.relative_humidity_2m,
          relative_humidity_unit:
            weatherData.current_units.relative_humidity_2m,
          apparent_temperature: weatherData.current.apparent_temperature,
          apparent_temperature_unit:
            weatherData.current_units.apparent_temperature,
          precipitation: weatherData.current.precipitation,
          precipitation_unit: weatherData.current_units.precipitation,
          weather_code: weatherData.current.weather_code,
          wind_speed: weatherData.current.wind_speed_10m,
          wind_speed_unit: weatherData.current_units.wind_speed_10m,
          uv_index: weatherData.current.uv_index,
          uv_index_unit: weatherData.current_units.uv_index,
          time: weatherData.current.time,
        },
      };
    } catch (error) {
      console.error("Error in getWeatherByCity:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }
  },

  // Get weather by coordinates
  getWeatherByCoords: async (
    lat: number,
    lon: number
  ): Promise<WeatherResponse> => {
    try {
      const weatherData = await getWeather(lat, lon);

      if (!weatherData) {
        return {
          success: false,
          error: "Failed to fetch weather data. Please try again later.",
        };
      }

      return {
        success: true,
        location: {
          name: "Custom Location",
          country: "Unknown",
          latitude: lat,
          longitude: lon,
        },
        weather: {
          temperature: weatherData.current.temperature_2m,
          temperature_unit: weatherData.current_units.temperature_2m,
          relative_humidity: weatherData.current.relative_humidity_2m,
          relative_humidity_unit:
            weatherData.current_units.relative_humidity_2m,
          apparent_temperature: weatherData.current.apparent_temperature,
          apparent_temperature_unit:
            weatherData.current_units.apparent_temperature,
          precipitation: weatherData.current.precipitation,
          precipitation_unit: weatherData.current_units.precipitation,
          weather_code: weatherData.current.weather_code,
          wind_speed: weatherData.current.wind_speed_10m,
          wind_speed_unit: weatherData.current_units.wind_speed_10m,
          uv_index: weatherData.current.uv_index,
          uv_index_unit: weatherData.current_units.uv_index,
          time: weatherData.current.time,
        },
      };
    } catch (error) {
      console.error("Error in getWeatherByCoords:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }
  },
};

export type { CityCoords, WeatherData, WeatherResponse };
