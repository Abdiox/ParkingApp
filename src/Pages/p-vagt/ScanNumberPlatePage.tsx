import React, { useRef, useState, useEffect } from "react";
import { View, Button, ActivityIndicator, Alert, Text, StyleSheet, Image } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import { scanWithOCRSpace, hasActiveParkingByPlateNumber } from "../../Services/apiFacade";

export default function ScanNumberPlatePage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraLayout, setCameraLayout] = useState({ width: 0, height: 0 });

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
    // Beskær billedet (justér crop-værdierne til din app!)
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
      //fjerne mellemrum og gøre til store bogstaver
      const numberPlate = ocrResult.replace(/\s/g, "").toUpperCase();
      
      hasActiveParkingByPlateNumber(numberPlate)
        .then((hasActiveParking) => {
          if (hasActiveParking) {
            Alert.alert("Aktiv parkering fundet", `Nummerplade: ${numberPlate}`);
          } else {
            Alert.alert("Ingen aktiv parkering", `Nummerplade: ${numberPlate} har ingen aktiv parkering.`);
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
      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
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

