import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from "react-native";
import Home from "../Pages/User/Home";
import CreateCarPage from "../Pages/User/CreateCarPage";
import PAreaPage from "../Pages/User/PAreaPage";
import HistorikPage from "../Pages/User/HistorikPage";
import ContactPage from "../Pages/User/ContactPage";
// import AdminPage from "../Pages/AdminPage"; // hvis du skal bruge den
import CustomDrawerContent from "./CustomDrawerContent";
import BurgerMenuIcon from "./BurgerMenuIcon";
import { useAuth } from "../Security/AuthProvider";
import PVagtHomePage from "../Pages/p-vagt/PVagtHomePage";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const {user} = useAuth();

  if (!user) {
    // Returner ingenting, mens brugeren er logget ud
    return null;
  }

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
      {user && user.role === "USER" && <Drawer.Screen name="🏠 Hjem" component={Home} />}
      {user && user.role === "USER" && <Drawer.Screen name="🚘 Tilføj bil" component={CreateCarPage} />}
      {user && user.role === "USER" && <Drawer.Screen name="🅿️ Parkerings Områder" component={PAreaPage} />}
      {user && user.role === "USER" && <Drawer.Screen name="🕒 Historik" component={HistorikPage} />}
      {user && user.role === "USER" && <Drawer.Screen name="📞 Kontakt os" component={ContactPage} />}
      {user && user.role === "PVAGT" && <Drawer.Screen name="P-vagt" component={PVagtHomePage} />}
      {/* <Drawer.Screen name="AdminPage" component={AdminPage} /> */}
    </Drawer.Navigator>
  );
}