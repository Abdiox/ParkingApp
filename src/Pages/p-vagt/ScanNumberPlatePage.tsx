import React, { useRef, useState, useEffect } from "react";
import { View, Button, ActivityIndicator, Alert, Text, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';

export default function ScanNumberPlatePage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

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

    // Beskær billedet (justér crop-værdierne til din app!)
    const cropped = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ crop: { originX: 100, originY: 300, width: 400, height: 120 } }],
      { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    
    const ocrResult = await scanWithOCRSpace(cropped.base64);
    setIsLoading(false);
    if (ocrResult) {
      Alert.alert("Nummerplade fundet", ocrResult);
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
        facing="back"
        ratio="16:9"
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

// OCR.space API-kald
async function scanWithOCRSpace(base64Image: string): Promise<string | null> {
  const apiKey = "K89400181888957"; // Gratis testnøgle, lav evt. din egen på ocr.space
  const formData = new FormData();
  formData.append("base64Image", "data:image/jpg;base64," + base64Image);
  formData.append("language", "dan");
  formData.append("isOverlayRequired", "false");
  console.log("Base64 length:", base64Image.length);
  

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: apiKey,
    },
    body: formData,
  });
  const data = await response.json();

  console.log("OCR Response:", data);
  
  try {
    const text = data.ParsedResults[0].ParsedText;
    const match = text.match(/[A-ZÆØÅ]{2}[-\s]?\d{2}[-\s]?\d{3}/i);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}