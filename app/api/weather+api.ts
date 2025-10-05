import { weatherOperations } from "@/lib/weather";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const latitude = searchParams.get("latitude") || searchParams.get("lat");
    const longitude = searchParams.get("longitude") || searchParams.get("lon");

    let weatherData;

    // Check if coordinates are provided as separate parameters (faster querying)
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      // Validate coordinate ranges
      if (
        isNaN(lat) ||
        isNaN(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {
        return Response.json(
          {
            success: false,
            error:
              "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.",
          },
          { status: 400 }
        );
      }

      weatherData = await weatherOperations.getWeatherByCoords(lat, lon);
    } else if (location) {
      // Check if location is coordinates (lat,lon format)
      const coordsMatch = location.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);

      if (coordsMatch) {
        // Location is coordinates
        const lat = parseFloat(coordsMatch[1]);
        const lon = parseFloat(coordsMatch[2]);

        // Validate coordinate ranges
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          return Response.json(
            {
              success: false,
              error:
                "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.",
            },
            { status: 400 }
          );
        }

        weatherData = await weatherOperations.getWeatherByCoords(lat, lon);
      } else {
        // Location is city name
        weatherData = await weatherOperations.getWeatherByCity(location);
      }
    } else {
      return Response.json(
        {
          success: false,
          error:
            "Either 'location' parameter or both 'latitude'/'lat' and 'longitude'/'lon' parameters are required",
        },
        { status: 400 }
      );
    }

    if (!weatherData.success) {
      return Response.json(weatherData, { status: 404 });
    }

    return Response.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
