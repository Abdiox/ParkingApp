import React from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, View } from "react-native";
import LogoutButton from "../Components/LogoutButton";

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#f5f5f5" }}>
      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <Image
          source={{ uri: "https://i.ibb.co/s9G1hDDc/AMPARKING-Apr-28-2025-01-54-15-PM-removebg-preview.png" }}
          style={{ width: 120, height: 120, resizeMode: "contain" }}
        />
      </View>
      <DrawerItemList {...props} />
      <LogoutButton />
    </DrawerContentScrollView>
  );
}