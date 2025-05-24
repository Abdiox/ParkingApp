import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Case, getCasesByUserId } from "../../Services/apiFacade";
import { useAuth } from "../../Security/AuthProvider";
import { FAB } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import ConfirmDialog from "../../Components/ConfirmDialog";
import CaseCard from "../../Components/CaseCard";

export default function PVagtHomePage({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUserCases() {
      const allUsersCases = await getCasesByUserId(user.id);
      console.log("Fetched cases:", allUsersCases);
      setCases(allUsersCases);
    }
    fetchUserCases();
  }, [user.id]);


    const handleDelete = async () => {

      console.log("Handle delete clicked");
      
    };

  const confirmDelete = (caseId: number) => {
    setSelectedCaseId(caseId);
    setShowConfirmDialog(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine sager</Text>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 150 }}>
        {cases.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Ingen aktive sager</Text>
        ) : (
          cases.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              caseData={caseItem}
              onDelete={() => confirmDelete(caseItem.id!)}
            />

          ))
        )}
      </ScrollView>
      <LinearGradient
        colors={[
          'rgba(245,245,245,0)',  
          'rgba(245,245,245,0.7)', 
          'rgba(245,245,245,1)'    
        ]}
        style={styles.fabBackground}
        pointerEvents="none"
      />
      <FAB
        style={styles.fab}
        icon="camera" // eller "barcode-scan" hvis du har det ikon
        color="#f5f5f5"
        onPress={() => navigation.navigate("ScanNumberPlate")}
        size="large"
        customSize={76}
      />
      <ConfirmDialog
        visible={showConfirmDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDialog(false)}
        message="Er du sikker på, at du vil slette denne Sag?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    left: "50%",
    bottom: 52,
    backgroundColor: "#007BFF",
    marginLeft: -38, // Halvdelen af customSize (hvis customSize=64)
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderRadius: 50,
  },
  fabBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 140, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

  },
});