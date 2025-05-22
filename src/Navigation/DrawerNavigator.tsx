import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from "react-native";
import Home from "../Pages/Home";
import CreateCarPage from "../Pages/CreateCarPage";
import PAreaPage from "../Pages/PAreaPage";
import HistorikPage from "../Pages/HistorikPage";
import ContactPage from "../Pages/ContactPage";
// import AdminPage from "../Pages/AdminPage"; // hvis du skal bruge den
import CustomDrawerContent from "./CustomDrawerContent";
import BurgerMenuIcon from "./BurgerMenuIcon";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        width: "66%",
        backgroundColor: "#222",
      }}
      screenOptions={{
        drawerPosition: "right",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#f9f9f9",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: "#007BFF",
        headerTitle: "",
        headerLeft: () => (
          <Image
            source={{
              uri: "https://i.ibb.co/s9G1hDDc/AMPARKING-Apr-28-2025-01-54-15-PM-removebg-preview.png",
            }}
            style={{ width: 80, height: 80, resizeMode: "contain", marginTop: 10 }}
          />
        ),
        headerRight: () => <BurgerMenuIcon />,
      }}
    >
      <Drawer.Screen name="🏠 Hjem" component={Home} />
      <Drawer.Screen name="🚘 Tilføj bil" component={CreateCarPage} />
      <Drawer.Screen name="🅿️ Parkerings Områder" component={PAreaPage} />
      <Drawer.Screen name="🕒 Historik" component={HistorikPage} />
      <Drawer.Screen name="📞 Kontakt os" component={ContactPage} />
      {/* <Drawer.Screen name="AdminPage" component={AdminPage} /> */}
      {/* {userData?.role === "Admin" && <Drawer.Screen name="AdminPage" component={AdminPage} />} */}
    </Drawer.Navigator>
  );
}