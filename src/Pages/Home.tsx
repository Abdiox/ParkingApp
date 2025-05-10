// Home.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";


export default function Home({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home</Text>
        <Button
            mode="contained"
            onPress= {() => navigation.navigate("RegisterParking")}
            buttonColor="#007BFF"
            textColor="#fff"
            style={styles.addParkingButton}
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 18, fontWeight: "bold" }}
          >
            +
          </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addParkingButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 90,
    padding: 10,
    marginTop: 20,
    width: "30%",
    height: 50,
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
  },
});