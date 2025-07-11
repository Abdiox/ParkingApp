import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import DeleteAnimation from "../Components/Animations/DeleteAnimation.json";

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  isDeleting: boolean;
}

export default function ConfirmDialog({ visible, onConfirm, onCancel, message, isDeleting }: ConfirmDialogProps) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {isDeleting ? (
            <View style={styles.lottieContainer}>
              <LottieView
                source={DeleteAnimation}
                autoPlay
                loop
                style={{ width: 100, height: 100 }}
              />
              <Text>Sletter bil...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                  <Text style={styles.buttonText}>Ja</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                  <Text style={styles.buttonText}>Nej</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  lottieContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});