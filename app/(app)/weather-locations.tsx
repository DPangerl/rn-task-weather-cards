import { LocationSelectionModal } from "@/components/LocationSelectionModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useWeatherLocations } from "@/hooks/useWeatherLocations";
import { LocationChoice, locationOperations } from "@/lib/locationOperations";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WeatherLocationsScreen() {
  const {
    locations,
    addLocation: addLocationHook,
    removeLocation: removeLocationHook,
  } = useWeatherLocations();
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  const [locationChoices, setLocationChoices] = useState<LocationChoice[]>([]);
  const [validationQuery, setValidationQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<LocationChoice[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Add new location with validation
  const addLocation = async () => {
    if (!newLocationName.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid city name");
      return;
    }

    setIsValidatingLocation(true);

    try {
      // Validate location using the API
      const validation = await locationOperations.validateLocation(
        newLocationName.trim()
      );

      if (!validation.success) {
        Alert.alert(
          "Location Not Found",
          validation.message || "Unable to find this location"
        );
        return;
      }

      // If exact match or only one result, add directly
      if (validation.exact_match || validation.results.length === 1) {
        const location = locationOperations.getBestMatch(validation.results);
        if (location) {
          const locationChoice = locationOperations.formatLocationChoices([
            location,
          ])[0];
          const finalName = locationOperations.createShortName(locationChoice);

          console.log("About to add location:", {
            finalName,
            latitude: locationChoice.latitude,
            longitude: locationChoice.longitude,
            locationChoice,
          });

          await addLocationHook(
            finalName,
            locationChoice.latitude,
            locationChoice.longitude
          );
          setNewLocationName("");
          setIsAddingLocation(false);
        }
      } else {
        // Multiple locations found, show selection modal
        const choices = locationOperations.formatLocationChoices(
          validation.results
        );
        setLocationChoices(choices);
        setValidationQuery(newLocationName.trim());
        setShowLocationSelection(true);
      }
    } catch (error) {
      console.error("Location validation error:", error);
      Alert.alert("Error", "Failed to validate location. Please try again.");
    } finally {
      setIsValidatingLocation(false);
    }
  };

  // Handle location selection from modal
  const handleLocationSelect = async (location: LocationChoice) => {
    setShowLocationSelection(false);

    const finalName = locationOperations.createShortName(location);
    console.log("HandleLocationSelect called with:", {
      finalName,
      latitude: location.latitude,
      longitude: location.longitude,
      location,
    });
    await addLocationHook(finalName, location.latitude, location.longitude);

    setNewLocationName("");
    setIsAddingLocation(false);
    setLocationChoices([]);
    setValidationQuery("");
  };

  // Handle location selection cancellation
  const handleLocationCancel = () => {
    setShowLocationSelection(false);
    setLocationChoices([]);
    setValidationQuery("");
  };

  // Search for location suggestions as user types
  const searchLocations = async (query: string) => {
    console.log("searchLocations called with:", query);

    if (!query.trim() || query.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    console.log("Starting search for:", query.trim());

    try {
      const validation = await locationOperations.validateLocation(
        query.trim()
      );
      console.log("Validation result:", validation);

      if (validation.success && validation.results.length > 0) {
        const suggestions = locationOperations.formatLocationChoices(
          validation.results
        );
        console.log("Formatted suggestions:", suggestions);
        setSearchSuggestions(suggestions.slice(0, 8)); // Limit to 8 suggestions
        setShowSuggestions(true);
        console.log(
          "Set showSuggestions to true, suggestions count:",
          suggestions.length
        );
      } else {
        console.log("No valid results found");
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle text input change with debounced search
  const handleLocationNameChange = (text: string) => {
    setNewLocationName(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(text);
    }, 300); // 300ms debounce
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: LocationChoice) => {
    const finalName = locationOperations.createShortName(suggestion);

    setNewLocationName(finalName);
    setShowSuggestions(false);
    setSearchSuggestions([]);

    // Automatically add the selected location
    console.log("Adding suggestion with coordinates:", {
      finalName,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      suggestion,
    });
    await addLocationHook(finalName, suggestion.latitude, suggestion.longitude);
    setNewLocationName("");
    setIsAddingLocation(false);
  };

  // Delete location
  const deleteLocation = (locationId: string) => {
    const locationToDelete = locations.find((loc) => loc.id === locationId);
    if (!locationToDelete) return;

    Alert.alert(
      "Delete Location",
      `Are you sure you want to remove "${locationToDelete.name}" from your weather locations?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeLocationHook(locationId);
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Location Section */}
        <View style={styles.section}>
          {!isAddingLocation ? (
            <Pressable
              style={styles.addButton}
              onPress={() => setIsAddingLocation(true)}
              android_ripple={{ color: "rgba(0, 122, 255, 0.1)" }}
            >
              <IconSymbol name="plus.circle.fill" size={22} color="#007AFF" />
              <ThemedText style={styles.addButtonText}>
                Add New Location
              </ThemedText>
            </Pressable>
          ) : (
            <View style={styles.addLocationContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter city name (e.g., New York, NY)"
                placeholderTextColor="#8E8E93"
                value={newLocationName}
                onChangeText={handleLocationNameChange}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={addLocation}
              />

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {searchSuggestions.length > 0 ? (
                    <ScrollView
                      style={styles.suggestionsList}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <Pressable
                          key={suggestion.id}
                          style={[
                            styles.suggestionItem,
                            index !== searchSuggestions.length - 1 &&
                              styles.suggestionItemBorder,
                          ]}
                          onPress={() => handleSuggestionSelect(suggestion)}
                          android_ripple={{ color: "rgba(0, 122, 255, 0.1)" }}
                        >
                          <View style={styles.suggestionContent}>
                            <View style={styles.suggestionIcon}>
                              <IconSymbol
                                name="location.fill"
                                size={14}
                                color="#007AFF"
                              />
                            </View>
                            <View style={styles.suggestionText}>
                              <ThemedText style={styles.suggestionName}>
                                {suggestion.name}
                              </ThemedText>
                              <ThemedText style={styles.suggestionDetails}>
                                {suggestion.admin1 &&
                                  suggestion.admin1 !== suggestion.name && (
                                    <>{suggestion.admin1}, </>
                                  )}
                                {suggestion.country}
                              </ThemedText>
                            </View>
                          </View>
                        </Pressable>
                      ))}
                    </ScrollView>
                  ) : (
                    <ThemedText style={{ padding: 10, textAlign: "center" }}>
                      No suggestions available
                    </ThemedText>
                  )}
                  {isSearching && (
                    <View style={styles.searchingIndicator}>
                      <ThemedText style={styles.searchingText}>
                        Searching...
                      </ThemedText>
                    </View>
                  )}
                </View>
              )}
              <View style={styles.addLocationButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsAddingLocation(false);
                    setNewLocationName("");
                    setShowSuggestions(false);
                    setSearchSuggestions([]);
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isValidatingLocation && styles.saveButtonDisabled,
                  ]}
                  onPress={addLocation}
                  activeOpacity={0.7}
                  disabled={isValidatingLocation}
                >
                  <ThemedText style={styles.saveButtonText}>
                    {isValidatingLocation ? "Validating..." : "Add"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Locations List */}
        {locations.length > 0 ? (
          <View style={styles.locationsSection}>
            <ThemedText style={styles.sectionTitle}>
              Your Locations ({locations.length})
            </ThemedText>
            <View style={styles.locationsList}>
              {locations.map((location, index) => (
                <View
                  key={location.id}
                  style={[
                    styles.locationRow,
                    index !== locations.length - 1 && styles.locationRowBorder,
                  ]}
                >
                  <View style={styles.locationInfo}>
                    <View style={styles.locationIcon}>
                      <IconSymbol
                        name="location.fill"
                        size={16}
                        color="#007AFF"
                      />
                    </View>
                    <View style={styles.locationText}>
                      <ThemedText style={styles.locationName}>
                        {location.name}
                      </ThemedText>
                      <ThemedText style={styles.locationDate}>
                        Added {new Date(location.addedAt).toLocaleDateString()}
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteLocation(location.id)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol name="trash" size={16} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="location" size={48} color="#C7C7CC" />
            <ThemedText style={styles.emptyStateTitle}>
              No Locations Yet
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtitle}>
              Add your first weather location to get started
            </ThemedText>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Location Selection Modal */}
      <LocationSelectionModal
        visible={showLocationSelection}
        locations={locationChoices}
        query={validationQuery}
        onSelect={handleLocationSelect}
        onCancel={handleLocationCancel}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 17,
    color: "#007AFF",
    marginLeft: 8,
    fontWeight: "500",
  },
  addLocationContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    overflow: "visible", // Ensure suggestions aren't clipped
  },
  textInput: {
    fontSize: 17,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    marginBottom: 12,
  },
  addLocationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 17,
    color: "#8E8E93",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 17,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  saveButtonDisabled: {
    backgroundColor: "#8E8E93",
    opacity: 0.6,
  },
  locationsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  locationsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  locationRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontSize: 17,
    fontWeight: "400",
    marginBottom: 2,
  },
  locationDate: {
    fontSize: 13,
    opacity: 0.6,
  },
  deleteButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 22,
  },
  bottomPadding: {
    height: 50,
  },
  // Suggestions styles
  suggestionsContainer: {
    backgroundColor: "#FFFFFF", // Back to white
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 150, // Define explicit height for ScrollView
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 50, // Ensure minimum height for touch targets
    backgroundColor: "#FFFFFF", // Explicit background
  },
  suggestionItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E1E1E1",
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  suggestionDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  searchingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E1E1E1",
    alignItems: "center",
  },
  searchingText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
