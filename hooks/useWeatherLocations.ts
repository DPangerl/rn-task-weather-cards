import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface WeatherLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  addedAt: string;
  userId: number;
}

const STORAGE_KEY = "weather_locations";

export function useWeatherLocations() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<WeatherLocation[]>([]);

  // Load user's locations
  const loadLocations = useCallback(async () => {
    if (!user?.id) {
      setLocations([]);
      return;
    }

    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const allLocations: WeatherLocation[] = stored ? JSON.parse(stored) : [];
    const userLocations = allLocations.filter((loc) => loc.userId === user.id);
    setLocations(userLocations);
  }, [user?.id]);

  // Add location
  const addLocation = useCallback(
    async (name: string, latitude: number, longitude: number) => {
      if (!user?.id) return;

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allLocations: WeatherLocation[] = stored ? JSON.parse(stored) : [];

      const newLocation: WeatherLocation = {
        id: Date.now().toString(),
        name,
        latitude,
        longitude,
        addedAt: new Date().toISOString(),
        userId: user.id,
      };

      allLocations.push(newLocation);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLocations));
      await loadLocations();
    },
    [user?.id, loadLocations]
  );

  // Remove location
  const removeLocation = useCallback(
    async (locationId: string) => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allLocations: WeatherLocation[] = stored ? JSON.parse(stored) : [];
      const filtered = allLocations.filter((loc) => loc.id !== locationId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      await loadLocations();
    },
    [loadLocations]
  );

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return {
    locations,
    addLocation,
    removeLocation,
    refreshLocations: loadLocations,
  };
}
