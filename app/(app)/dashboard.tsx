import { SortingModal } from "@/components/SortingModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { WeatherCard } from "@/components/WeatherCard";
import { useWeatherLocations } from "@/hooks/useWeatherLocations";
import { WeatherResponse } from "@/lib/weather";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WeatherDataMap {
  [locationId: string]: {
    data?: WeatherResponse;
    isLoading: boolean;
    error?: string;
  };
}

type SortCriteria =
  | "name"
  | "temperature"
  | "humidity"
  | "wind"
  | "uv"
  | "rain";

const SORT_OPTIONS: { key: SortCriteria; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "temperature", label: "Temperature" },
  { key: "humidity", label: "Humidity" },
  { key: "wind", label: "Wind Speed" },
  { key: "uv", label: "UV Index" },
  { key: "rain", label: "Precipitation" },
];

export default function HomeScreen() {
  const { locations, refreshLocations } = useWeatherLocations();
  const [weatherData, setWeatherData] = useState<WeatherDataMap>({});
  const [refreshing, setRefreshing] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("name");
  const [sortAscending, setSortAscending] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const fetchWeatherForLocation = async (
    locationId: string,
    latitude: number,
    longitude: number
  ) => {
    console.log("Fetching weather for", locationId, latitude, longitude);

    setWeatherData((prev) => ({
      ...prev,
      [locationId]: { isLoading: true },
    }));

    try {
      const response = await fetch(
        `/api/weather?latitude=${latitude}&longitude=${longitude}`
      );
      const data: WeatherResponse = await response.json();

      setWeatherData((prev) => ({
        ...prev,
        [locationId]: { data, isLoading: false },
      }));
    } catch (error) {
      console.error(
        `Error fetching weather for location ${locationId}:`,
        error
      );
      setWeatherData((prev) => ({
        ...prev,
        [locationId]: {
          isLoading: false,
          error: "Failed to load weather data",
        },
      }));
    }
  };

  const fetchAllWeatherData = React.useCallback(async () => {
    console.log("All locations:", locations); // Debug log to see what's stored
    for (const location of locations) {
      console.log("Location object:", location); // Debug each location
      await fetchWeatherForLocation(
        location.id,
        location.latitude,
        location.longitude
      );
    }
  }, [locations]);

  const onRefresh = async () => {
    setRefreshing(true);
    refreshLocations();
    await fetchAllWeatherData();
    setRefreshing(false);
  };

  // Sort locations based on criteria
  const sortedLocations = useMemo(() => {
    if (locations.length === 0) return [];

    const sorted = [...locations].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      const aWeatherData = weatherData[a.id]?.data;
      const bWeatherData = weatherData[b.id]?.data;

      switch (sortCriteria) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "temperature":
          aValue = aWeatherData?.weather?.temperature || -999;
          bValue = bWeatherData?.weather?.temperature || -999;
          break;
        case "humidity":
          aValue = aWeatherData?.weather?.relative_humidity || -1;
          bValue = bWeatherData?.weather?.relative_humidity || -1;
          break;
        case "wind":
          aValue = aWeatherData?.weather?.wind_speed || -1;
          bValue = bWeatherData?.weather?.wind_speed || -1;
          break;
        case "uv":
          aValue = aWeatherData?.weather?.uv_index || -1;
          bValue = bWeatherData?.weather?.uv_index || -1;
          break;
        case "rain":
          aValue = aWeatherData?.weather?.precipitation || -1;
          bValue = bWeatherData?.weather?.precipitation || -1;
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortAscending
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return sorted;
  }, [locations, weatherData, sortCriteria, sortAscending]);

  // Refresh locations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshLocations();
    }, [refreshLocations])
  );

  useEffect(() => {
    if (locations.length > 0) {
      fetchAllWeatherData();
    }
  }, [locations, fetchAllWeatherData]);

  if (locations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ThemedText style={styles.emptyTitle}>
            No Weather Locations
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Add some locations in the Weather Locations tab to see weather data
            here.
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Weather Dashboard</ThemedText>
          <ThemedText style={styles.subtitle}>
            {locations.length} location{locations.length !== 1 ? "s" : ""}
          </ThemedText>
        </ThemedView>

        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortOptions(true)}
          >
            <ThemedText style={styles.sortButtonText}>
              📊 Sort & Filter
            </ThemedText>
            <ThemedText style={styles.sortStatusText}>
              {SORT_OPTIONS.find((opt) => opt.key === sortCriteria)?.label}{" "}
              {sortAscending ? "↑" : "↓"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <SortingModal
          visible={showSortOptions}
          onClose={() => setShowSortOptions(false)}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
          sortAscending={sortAscending}
          setSortAscending={setSortAscending}
        />

        {sortedLocations.map((location) => (
          <WeatherCard
            key={location.id}
            locationName={location.name}
            weatherData={weatherData[location.id]?.data}
            isLoading={weatherData[location.id]?.isLoading}
            error={weatherData[location.id]?.error}
          />
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#666",
  },
  bottomSpacing: {
    height: 20,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  sortStatusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
});
