import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LocationChoice } from "@/lib/locationOperations";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface LocationSelectionModalProps {
  visible: boolean;
  locations: LocationChoice[];
  query: string;
  onSelect: (location: LocationChoice) => void;
  onCancel: () => void;
}

export function LocationSelectionModal({
  visible,
  locations,
  query,
  onSelect,
  onCancel,
}: LocationSelectionModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Select Location</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText style={styles.description}>
            Multiple locations found for &ldquo;{query}&rdquo;. Please select
            the correct one:
          </ThemedText>

          <ScrollView
            style={styles.locationsList}
            showsVerticalScrollIndicator={false}
          >
            {locations.map((location, index) => (
              <Pressable
                key={location.id}
                style={[
                  styles.locationItem,
                  index !== locations.length - 1 && styles.locationItemBorder,
                ]}
                onPress={() => onSelect(location)}
                android_ripple={{ color: "rgba(0, 122, 255, 0.1)" }}
              >
                <View style={styles.locationContent}>
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
                    <ThemedText style={styles.locationDetails}>
                      {location.admin1 && location.admin1 !== location.name && (
                        <>{location.admin1}, </>
                      )}
                      {location.country}
                    </ThemedText>
                    <ThemedText style={styles.locationCoordinates}>
                      {location.latitude.toFixed(4)},{" "}
                      {location.longitude.toFixed(4)}
                    </ThemedText>
                  </View>
                  <View style={styles.chevronContainer}>
                    <IconSymbol
                      name="chevron.right"
                      size={12}
                      color="#C7C7CC"
                    />
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 17,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.8,
  },
  locationsList: {
    flex: 1,
  },
  locationItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 1,
  },
  locationItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
    borderRadius: 0,
    marginBottom: 0,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 72,
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
    fontWeight: "500",
    marginBottom: 4,
  },
  locationDetails: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 2,
  },
  locationCoordinates: {
    fontSize: 13,
    opacity: 0.5,
    fontFamily: "SpaceMono-Regular",
  },
  chevronContainer: {
    paddingLeft: 8,
  },
});
