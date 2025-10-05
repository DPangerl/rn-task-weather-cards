import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type SortCriteria =
  | "name"
  | "temperature"
  | "humidity"
  | "wind"
  | "uv"
  | "rain";

interface SortingModalProps {
  visible: boolean;
  onClose: () => void;
  sortCriteria: SortCriteria;
  setSortCriteria: (criteria: SortCriteria) => void;
  sortAscending: boolean;
  setSortAscending: (ascending: boolean) => void;
}

const SORT_OPTIONS: { key: SortCriteria; label: string; icon: string }[] = [
  { key: "name", label: "Name", icon: "🏷️" },
  { key: "temperature", label: "Temperature", icon: "🌡️" },
  { key: "humidity", label: "Humidity", icon: "💧" },
  { key: "wind", label: "Wind Speed", icon: "💨" },
  { key: "uv", label: "UV Index", icon: "☀️" },
  { key: "rain", label: "Precipitation", icon: "🌧️" },
];

const { height: screenHeight } = Dimensions.get("window");

export const SortingModal: React.FC<SortingModalProps> = ({
  visible,
  onClose,
  sortCriteria,
  setSortCriteria,
  sortAscending,
  setSortAscending,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>
              Sort Weather Locations
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Sort Direction Toggle */}
          <ThemedView style={styles.directionSection}>
            <ThemedText style={styles.sectionTitle}>Sort Direction</ThemedText>
            <View style={styles.directionToggle}>
              <TouchableOpacity
                style={[
                  styles.directionButton,
                  sortAscending && styles.directionButtonActive,
                ]}
                onPress={() => setSortAscending(true)}
              >
                <ThemedText
                  style={[
                    styles.directionButtonText,
                    sortAscending && styles.directionButtonTextActive,
                  ]}
                >
                  ↑ Ascending
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.directionButton,
                  !sortAscending && styles.directionButtonActive,
                ]}
                onPress={() => setSortAscending(false)}
              >
                <ThemedText
                  style={[
                    styles.directionButtonText,
                    !sortAscending && styles.directionButtonTextActive,
                  ]}
                >
                  ↓ Descending
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          {/* Sort Criteria */}
          <ThemedView style={styles.criteriaSection}>
            <ThemedText style={styles.sectionTitle}>Sort By</ThemedText>
            <View style={styles.optionsContainer}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    sortCriteria === option.key && styles.sortOptionActive,
                  ]}
                  onPress={() => setSortCriteria(option.key)}
                >
                  <View style={styles.optionContent}>
                    <ThemedText style={styles.optionIcon}>
                      {option.icon}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.optionText,
                        sortCriteria === option.key && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                    {sortCriteria === option.key && (
                      <ThemedText style={styles.checkmark}>✓</ThemedText>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  directionSection: {
    padding: 20,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  directionToggle: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  directionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  directionButtonActive: {
    backgroundColor: "#007AFF",
  },
  directionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  directionButtonTextActive: {
    color: "white",
  },
  criteriaSection: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: "transparent",
  },
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortOption: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  sortOptionActive: {
    backgroundColor: "rgba(0, 122, 255, 0.08)",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  optionTextActive: {
    fontWeight: "700",
    color: "#007AFF",
  },
  checkmark: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});
