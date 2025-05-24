import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Car, getUserCars, getCarFromNumberplate } from "../../Services/apiFacade";
import { useAuth } from "../../Security/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FindNumberPlatePage({ navigation, route }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const { user } = useAuth();
   if (!user) {
    return null;
  }

  const parkingDraft = route.params?.parkingDraft;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const userCars = await getUserCars(user.id);
        setCars(userCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  // Søg på nummerplade via API
  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const result = await getCarFromNumberplate(search.trim());
      setSearchResult(result);
    } catch (error) {
      setSearchError("Ingen bil fundet eller fejl i søgning.");
    } finally {
      setSearching(false);
    }
  };

  // Vælg bil fra API-resultat
  const handleSelectApiCar = (car) => {
    const updatedDraft = { ...parkingDraft, plateNumber: car.registration_number, carBrand: car.make, carModel: car.model, carColor: car.color };
    navigation.navigate("RegisterParking", {
      selectedPlate: car.registration_number,
      parkingDraft: updatedDraft,
    });
  };

  // Vælg bil fra gemte biler
  const handleSelect = (car: Car) => {
    const updatedDraft = { ...parkingDraft, plateNumber: car.registrationNumber, carBrand: car.color, carModel: car.model, carColor: car.color };
    navigation.navigate("RegisterParking", {
      selectedPlate: car.registrationNumber,
      parkingDraft: updatedDraft,
    });
  };

  // Render for gemte biler
  const renderCar = ({ item: car }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelect(car)}>
      <View style={styles.row}>
        <MaterialCommunityIcons name="car" size={32} color="#007BFF" style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.plate}>{car.registrationNumber}</Text>
          <Text style={styles.info}>{car.make} {car.model} • {car.color}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render for API-resultat
  const renderApiCar = (car) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectApiCar(car)}>
      <View style={styles.row}>
        <MaterialCommunityIcons name="car" size={32} color="#007BFF" style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.plate}>{car.registration_number}</Text>
          <Text style={styles.info}>
            {car.make} {car.model} • {car.color}
          </Text>
          <Text style={styles.infoSmall}>
            {car.variant} • {car.model_year}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vælg køretøj</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Søg efter nummerplade..."
          value={search}
          onChangeText={text => {
            setSearch(text);
            setSearchResult(null);
            setSearchError("");
          }}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <MaterialCommunityIcons name="magnify" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Hvis der søges, vis kun API-resultat */}
      {search.trim() ? (
        searching ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 30 }} />
        ) : searchResult ? (
          renderApiCar(searchResult)
        ) : searchError ? (
          <Text style={{ textAlign: "center", marginTop: 30, color: "red" }}>{searchError}</Text>
        ) : null
      ) : (
        // Hvis ikke der søges, vis gemte biler
        cars.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen gemte køretøjer</Text>
        ) : (
          <FlatList
            data={cars}
            keyExtractor={car => car.id.toString()}
            renderItem={renderCar}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen matchende køretøjer</Text>
            }
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  search: {
    flex: 1,
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    marginLeft: 8,
    borderRadius: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  plate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 2,
  },
  info: {
    fontSize: 15,
    color: "#444",
  },
  infoSmall: {
    fontSize: 13,
    color: "#888",
  },
});