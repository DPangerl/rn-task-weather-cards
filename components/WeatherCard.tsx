import { WeatherResponse } from "@/lib/weather";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface WeatherCardProps {
  locationName: string;
  weatherData?: WeatherResponse;
  isLoading?: boolean;
  error?: string;
}

const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown";
};

const getWeatherEmoji = (code: number): string => {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "⛅";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "🌡️";
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  locationName,
  weatherData,
  isLoading,
  error,
}) => {
  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.locationName}>{locationName}</ThemedText>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {weatherData?.success && weatherData.weather && (
        <View style={styles.weatherContent}>
          <View style={styles.mainRow}>
            <ThemedText style={styles.emoji}>
              {getWeatherEmoji(weatherData.weather.weather_code)}
            </ThemedText>
            <View style={styles.weatherInfo}>
              <ThemedText style={styles.temperature}>
                {Math.round(weatherData.weather.temperature)}
                {weatherData.weather.temperature_unit}
              </ThemedText>
              <ThemedText style={styles.description}>
                {getWeatherDescription(weatherData.weather.weather_code)}
              </ThemedText>
              <ThemedText style={styles.feelsLike}>
                Feels like{" "}
                {Math.round(weatherData.weather.apparent_temperature)}
                {weatherData.weather.apparent_temperature_unit}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>UV Index</ThemedText>
              <ThemedText style={styles.detailValue}>
                {weatherData.weather.uv_index}
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Humidity</ThemedText>
              <ThemedText style={styles.detailValue}>
                {weatherData.weather.relative_humidity}%
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Wind</ThemedText>
              <ThemedText style={styles.detailValue}>
                {weatherData.weather.wind_speed}{" "}
                {weatherData.weather.wind_speed_unit}
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Rain</ThemedText>
              <ThemedText style={styles.detailValue}>
                {weatherData.weather.precipitation}
                {weatherData.weather.precipitation_unit}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {weatherData && !weatherData.success && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {weatherData.error || "Failed to load weather data"}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 8,
    color: "#1a1a1a",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
  },
  errorContainer: {
    paddingVertical: 12,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    textAlign: "center",
  },
  weatherContent: {
    gap: 4,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  weatherInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 28,
    marginRight: 12,
  },
  temperature: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
    color: "#1a1a1a",
    marginRight: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: "#666",
    flex: 1,
    marginRight: 8,
  },
  feelsLike: {
    fontSize: 12,
    lineHeight: 16,
    color: "#999",
    textAlign: "right",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: "#999",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  precipitation: {
    fontSize: 14,
    lineHeight: 20,
    color: "#007AFF",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
});
