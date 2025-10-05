export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  timezone: string;
  population?: number;
  country?: string;
  country_id: number;
}

export interface LocationValidationResponse {
  success: boolean;
  query: string;
  results: LocationResult[];
  exact_match: boolean;
  message?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { location } = body;

    if (!location || typeof location !== "string") {
      return Response.json(
        {
          success: false,
          query: location || "",
          results: [],
          exact_match: false,
          message: "Location name is required",
        } as LocationValidationResponse,
        { status: 400 }
      );
    }

    const trimmedLocation = location.trim();
    if (trimmedLocation.length < 2) {
      return Response.json(
        {
          success: false,
          query: trimmedLocation,
          results: [],
          exact_match: false,
          message: "Location name must be at least 2 characters long",
        } as LocationValidationResponse,
        { status: 400 }
      );
    }

    // Use Open-Meteo Geocoding API
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmedLocation
    )}&count=10&language=en&format=json`;

    const response = await fetch(geocodingUrl);

    if (!response.ok) {
      throw new Error(
        `Geocoding API responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return Response.json(
        {
          success: false,
          query: trimmedLocation,
          results: [],
          exact_match: false,
          message: `No locations found for "${trimmedLocation}". Please try a different search term.`,
        } as LocationValidationResponse,
        { status: 200 }
      );
    }

    // Process and enhance the results
    const results: LocationResult[] = data.results.map((result: any) => ({
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
      (result) => result.name.toLowerCase() === trimmedLocation.toLowerCase()
    );

    // If there's only one result and it's a close match, consider it exact
    const isCloseMatch =
      results.length === 1 &&
      results[0].name.toLowerCase().includes(trimmedLocation.toLowerCase());

    return Response.json(
      {
        success: true,
        query: trimmedLocation,
        results,
        exact_match: exactMatch || isCloseMatch,
        message:
          exactMatch || isCloseMatch
            ? "Location found successfully"
            : `Found ${results.length} possible locations for "${trimmedLocation}". Please select the correct one.`,
      } as LocationValidationResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Location validation error:", error);

    return Response.json(
      {
        success: false,
        query: "",
        results: [],
        exact_match: false,
        message:
          "An error occurred while searching for locations. Please try again.",
      } as LocationValidationResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<Response> {
  // Support GET request with query parameter
  const url = new URL(request.url);
  const location = url.searchParams.get("location");

  if (!location) {
    return Response.json(
      {
        success: false,
        query: "",
        results: [],
        exact_match: false,
        message: "Location query parameter is required",
      } as LocationValidationResponse,
      { status: 400 }
    );
  }

  // Create a mock request body for the POST handler
  const mockRequest = {
    json: async () => ({ location }),
    url: request.url,
  } as Request;

  return POST(mockRequest);
}
