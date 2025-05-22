import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BurgerMenuIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 15 }}>
      <MaterialIcons name="menu" size={32} color="#007BFF" />
    </TouchableOpacity>
  );
}