import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

interface CaseModalProps {
  visible: boolean;
  plate: string | null;
  onClose: () => void;
  onCreateCase: () => void;
}

export default function CaseModal({ visible, plate, onClose, onCreateCase }: CaseModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.text}>
            {plate} har ingen gyldig parkering.{"\n"}
            Har du scannet nummerpladen rigtigt?{'\n'}
            Hvis ja, opret sag.
          </Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.leftButton} onPress={onClose}>
              <Text style={{ color: "#333" }}>Tag billede igen</Text>
            </Pressable>
            <Pressable style={styles.rightButton} onPress={onCreateCase}>
              <Text style={{ color: "#fff" }}>Opret sag</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 24,
    width: "80%",
    alignItems: "center"
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  leftButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 6,
    alignItems: "center"
  },
  rightButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center"
  }
});