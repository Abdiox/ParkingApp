import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Parking, getUserParkingsByYear } from "../Services/apiFacade";
import { useAuth } from "../Security/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";

// Dansk månedsnavne
const monthNames = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December"
];

export default function HistorikPage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { userId } = useAuth();

  // Find nuværende måned/år
  const now = new Date();
  const isCurrentMonth = selectedMonth === now.getMonth() + 1 && currentYear === now.getFullYear();

  useEffect(() => {
    async function fetchParkings() {
      const data = await getUserParkingsByYear(userId, currentYear);
      setParkings(data);
    }
    fetchParkings();
  }, [currentYear, userId]);

  useEffect(() => {
    const filtered = parkings.filter((parking) => {
      const parkingDate = new Date(parking.startTime);
      return parkingDate.getMonth() + 1 === selectedMonth;
    });
    setFilteredParkings(filtered);
  }, [parkings, selectedMonth]);

  // Skift til forrige måned/år
  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  // Skift til næste måned/år (men ikke forbi nuværende måned/år)
  const handleNextMonth = () => {
    if (!isCurrentMonth) {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setCurrentYear((prev) => prev + 1);
      } else {
        setSelectedMonth((prev) => prev + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historik</Text>
      <View style={styles.monthNav}>
        <TouchableOpacity style={styles.arrowBtn} onPress={handlePreviousMonth}>
          <MaterialIcons name="chevron-left" size={32} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {monthNames[selectedMonth - 1]} {currentYear}
        </Text>
        {/* Skjul højre pil hvis vi er i nuværende måned/år */}
        {!isCurrentMonth ? (
          <TouchableOpacity style={styles.arrowBtn} onPress={handleNextMonth}>
            <MaterialIcons name="chevron-right" size={32} color="#007BFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} /> // Tom plads så layoutet ikke hopper
        )}
      </View>
      <FlatList
        data={filteredParkings}
        keyExtractor={(item) => (item.id ? item.id.toString() : "unknown-id")}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Ingen parkeringer i denne måned.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.parkingItem}>
            <Text style={styles.parkingTitle}>{item.plateNumber}</Text>
            {item.parea && (
              <Text style={styles.parkingInfo}>{item.parea.areaName}</Text>
            )}
            <Text style={styles.parkingInfo}>Start: {new Date(item.startTime).toLocaleString()}</Text>
            <Text style={styles.parkingInfo}>Slut: {new Date(item.endTime).toLocaleString()}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  arrowBtn: {
    padding: 8,
  },
  monthText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#007BFF",
    marginHorizontal: 16,
    minWidth: 120,
    textAlign: "center",
  },
  parkingItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  parkingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 4,
  },
  parkingInfo: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 16,
  },
});