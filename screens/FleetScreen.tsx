import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Input } from "react-native-elements";
import ColorChoiceInput from "../components/ColorChoiceInput";
import CarInputSystem from "../components/CarInputSystem";

export default function FleetScreen() {
  const [vehicles, setVehicles] = useState<any[] | null>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getVehicles();
  }, []);

  async function getVehicles() {
    let { data: vehicles, error } = await supabase.from("vehicles").select("*");

    setVehicles(vehicles);

    if (error) {
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      {vehicles?.map((v) => (
        <View style={styles.fleet_div}>
          <View style={styles.fleet_div_text}>
            <Text>{v.plate}</Text>
            <Text>
              {v.color} {v.make} {v.model} {v.year}
            </Text>
            <Text>
              {v.date} {v.time}
            </Text>
            <Text>Reg. Expires: {v.reg_expires}</Text>
          </View>
        </View>
      ))}

      <Pressable style={styles.add_button}>
        <Text
          style={styles.add_button_text}
          onPress={() => setModalVisible(true)}
        >
          + Add Vehicle
        </Text>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ColorChoiceInput />
              <CarInputSystem />

              <Text>Modal Here!</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  car_image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  fleet_div: {
    display: "flex",
    flexDirection: "row",
    width: "94%",
    backgroundColor: "white",
    margin: 8,
    padding: 8,
    gap: 10,
    borderRadius: 10,
    letterSpacing: 2,
    borderBottomColor: "gray",
    borderBottomWidth: 4,
    borderWidth: 1,
    borderColor: "lightgray",
    fontWeight: "900",
  },
  fleet_div_text: {
    display: "flex",
  },
  add_button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    width: 200,
    backgroundColor: "green",
  },
  add_button_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    maxWidth: "94%",
  },
});
