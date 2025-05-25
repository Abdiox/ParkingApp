import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import CreateCaseForm from "../../Form/CreateCaseForm";
import { useAuth } from "../../Security/AuthProvider";
import { addCase, Case } from "../../Services/apiFacade";


export default function CreateCasePage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { plateNumber } = route.params as { plateNumber: string };
  const now = new Date();
  const timeDisplay = now.toLocaleString("da-DK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const handleSubmit = async ({ description }: { description: string }) => {
  if (!user) return;
  try {
    const newCase: Case = {
      id: null,
      plateNumber: plateNumber, 
      time: now.toISOString(),         
      description,
      done: false,
      userId: user.id,
    };
    await addCase(newCase);
    Alert.alert("Succes", "Sagen er oprettet!");
    navigation.navigate("Menu");
  } catch (error) {
    Alert.alert("Fejl", "Kunne ikke oprette sag. Prøv igen.");
  }
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>OPRET SAG</Text>
        <CreateCaseForm plateNumber={plateNumber} onSubmit={handleSubmit} time={timeDisplay}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});