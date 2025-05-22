import React from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, TouchableOpacity, View, Text} from "react-native";
import LogoutButton from "../Components/LogoutButton";
import { useAuth } from "../Security/AuthProvider";
import { useNavigation } from "@react-navigation/native";


export default function CustomDrawerContent(props: any) {
  const { user } = useAuth();
  const navigation = useNavigation();

  // Hvis brugeren ikke er logget ind, kan du evt. vise en loader eller ingenting
  // if (!user) return null;

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#f5f5f5" }}>
      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <Image
          source={{ uri: "https://i.ibb.co/s9G1hDDc/AMPARKING-Apr-28-2025-01-54-15-PM-removebg-preview.png" }}
          style={{ width: 120, height: 120, resizeMode: "contain" }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("EditUserPage")}
          style={{ marginTop: 10, alignItems: "center" }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={{ color: "#666" }}>{user.address}</Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
      <LogoutButton />
    </DrawerContentScrollView>
  );
}