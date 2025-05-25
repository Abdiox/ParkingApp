import React, { useRef, useState, useEffect } from "react";
import { View, Button, ActivityIndicator, Alert, Text, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import { scanWithOCRSpace, hasActiveParkingByPlateNumber } from "../../Services/apiFacade";
import { useNavigation } from "@react-navigation/native";
import CaseModal from "../../Components/CaseModal"; 

export default function ScanNumberPlatePage() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraLayout, setCameraLayout] = useState({ width: 0, height: 0 });
  const [showModal, setShowModal] = useState(false);
  const [currentPlate, setCurrentPlate] = useState<string | null>(null);

  const cropBox = { left: 20, top: 300, width: 320, height: 100 };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePictureAndScan = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.3 });

      const scaleX = photo.width / cameraLayout.width;
      const scaleY = photo.height / cameraLayout.height;
      const crop = {
        originX: cropBox.left * scaleX,
        originY: cropBox.top * scaleY,
        width: cropBox.width * scaleX,
        height: cropBox.height * scaleY,
      };

      const cropped = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ crop }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      if (!cropped.base64) {
        setIsLoading(false);
        Alert.alert("Fejl", "Kunne ikke beskære billedet korrekt. Prøv igen.");
        return;
      }
      const ocrResult = await scanWithOCRSpace(cropped.base64);
      setIsLoading(false);
      if (ocrResult) {
        const numberPlate = ocrResult.replace(/\s/g, "").toUpperCase();
        hasActiveParkingByPlateNumber(numberPlate)
          .then((hasActiveParking) => {
            if (hasActiveParking) {
              Alert.alert("Aktiv parkering fundet", `Nummerplade: ${numberPlate}`);
            } else {
              setCurrentPlate(numberPlate);
              setShowModal(true);
              console.log("Nummerplade fundet:", numberPlate, " - ingen aktiv parkering.");
              
            }
          })
          .catch((error) => {
            console.error("Fejl ved tjek af aktiv parkering:", error);
            Alert.alert("Fejl", "Kunne ikke tjekke aktiv parkering. Prøv igen senere.");
          });
      } else {
        Alert.alert("Ingen nummerplade fundet", "Prøv igen med et tydeligere billede.");
      }
    }
  };

  const handleCreateCase = () => {
    setShowModal(false);
    navigation.navigate("CreateCase", {
      plateNumber: currentPlate,
    });
  };

  if (hasPermission === null) return <ActivityIndicator />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        ratio="16:9"
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          setCameraLayout({ width, height });
        }}
      />
      <View
        style={{
          position: "absolute",
          left: cropBox.left,
          top: cropBox.top,
          width: cropBox.width,
          height: cropBox.height,
          borderWidth: 2,
          borderColor: "red",
          backgroundColor: "rgba(255,0,0,0.1)",
        }}
        pointerEvents="none"
      />
      <View style={styles.buttonContainer}>
        <Button title="Tag billede og scan" onPress={takePictureAndScan} disabled={isLoading} />
        <View style={{ height: 10 }} />
        <Button
          title="Indtast nummerplade manuelt"
          onPress={() => navigation.navigate("ManuelScanNumberPlate")}
          color="#888"
        />
        {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </View>
      <CaseModal
        visible={showModal}
        plate={currentPlate}
        onClose={() => setShowModal(false)}
        onCreateCase={handleCreateCase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: "70%",
  },
});


