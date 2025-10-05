import {
  LocationResult,
  LocationValidationResponse,
} from "@/app/api/location+api";

export interface LocationChoice {
  id: number;
  name: string;
  displayName: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export const locationOperations = {
  // Validate and search for locations
  async validateLocation(
    locationName: string
  ): Promise<LocationValidationResponse> {
    try {
      console.log(
        "Making direct API call to Open-Meteo for location:",
        locationName
      );

      // Call Open-Meteo directly for now to test
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        locationName
      )}&count=10&language=en&format=json`;

      console.log("Geocoding URL:", geocodingUrl);

      const response = await fetch(geocodingUrl);
      console.log("Open-Meteo Response status:", response.status);

      if (!response.ok) {
        console.error(
          "Open-Meteo Response not ok:",
          response.status,
          response.statusText
        );
        throw new Error(
          `Open-Meteo API responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Open-Meteo Response data:", data);

      if (!data.results || data.results.length === 0) {
        return {
          success: false,
          query: locationName,
          results: [],
          exact_match: false,
          message: `No locations found for "${locationName}". Please try a different search term.`,
        };
      }

      // Process and enhance the results (similar to API route)
      const results = data.results.map((result: any) => ({
        id: result.id,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        elevation: result.elevation || 0,
        feature_code: result.feature_code || "UNKNOWN",
        country_code: result.country_code,
        admin1: result.admin1,
        admin2: result.admin2,
        admin3: result.admin3,
        admin4: result.admin4,
        timezone: result.timezone,
        population: result.population,
        country: result.country,
        country_id: result.country_id,
      }));

      // Check for exact match (case-insensitive)
      const exactMatch = results.some(
        (result: any) =>
          result.name.toLowerCase() === locationName.toLowerCase()
      );

      // If there's only one result and it's a close match, consider it exact
      const isCloseMatch =
        results.length === 1 &&
        results[0].name.toLowerCase().includes(locationName.toLowerCase());

      return {
        success: true,
        query: locationName,
        results,
        exact_match: exactMatch || isCloseMatch,
        message:
          exactMatch || isCloseMatch
            ? "Location found successfully"
            : `Found ${results.length} possible locations for "${locationName}". Please select the correct one.`,
      };
    } catch (error) {
      console.error("Location validation error:", error);
      return {
        success: false,
        query: locationName,
        results: [],
        exact_match: false,
        message: "Network error occurred while validating location",
      };
    }
  },

  // Format location results for user selection
  formatLocationChoices(results: LocationResult[]): LocationChoice[] {
    return results.map((result) => {
      // Create a readable display name
      let displayName = result.name;

      if (result.admin1 && result.admin1 !== result.name) {
        displayName += `, ${result.admin1}`;
      }

      if (result.country && result.country !== result.admin1) {
        displayName += `, ${result.country}`;
      }

      // Add population info for large cities
      if (result.population && result.population > 100000) {
        displayName += ` (${Math.round(result.population / 1000)}k)`;
      }

      return {
        id: result.id,
        name: result.name,
        displayName,
        country: result.country || result.country_code,
        admin1: result.admin1,
        latitude: result.latitude,
        longitude: result.longitude,
      };
    });
  },

  // Get the best automatic match from results
  getBestMatch(results: LocationResult[]): LocationResult | null {
    if (results.length === 0) return null;

    // Prefer populated places over geographic features
    const cities = results.filter(
      (r) =>
        r.feature_code &&
        ["PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLC"].includes(
          r.feature_code
        )
    );

    if (cities.length > 0) {
      // Return the most populated city
      return cities.reduce((best, current) =>
        (current.population || 0) > (best.population || 0) ? current : best
      );
    }

    // Fallback to first result
    return results[0];
  },

  // Check if a location name needs user confirmation
  needsUserChoice(response: LocationValidationResponse): boolean {
    return (
      response.success && response.results.length > 1 && !response.exact_match
    );
  },

  // Create a short location name for storage
  createShortName(location: LocationChoice): string {
    if (location.admin1 && location.admin1 !== location.name) {
      return `${location.name}, ${location.admin1}`;
    }

    if (location.country && location.country !== location.name) {
      return `${location.name}, ${location.country}`;
    }

    return location.name;
  },
};
