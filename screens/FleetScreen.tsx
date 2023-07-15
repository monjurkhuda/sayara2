import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { supabase } from "../lib/supabase";
import CarChoiceInput from "../components/CarChoiceInput";

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
    <ScrollView style={styles.container}>
      {vehicles?.map((v) => (
        <View style={styles.fleet_div}>
          <View style={styles.fleet_div_text}>
            <Text>{v.plate}</Text>
            <Text>
              {v.color.toUpperCase()} {v.make} {v.model} {v.year}
            </Text>
            <Text>Reg. Expires: {v.reg_expires}</Text>
            <Text>Last Inspection: {v.last_inspection}</Text>
          </View>
        </View>
      ))}

      <View style={styles.button_container}>
        <Pressable style={styles.add_button}>
          <Text
            style={styles.add_button_text}
            onPress={() => setModalVisible(true)}
          >
            + Add Vehicle
          </Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </Pressable>
              <CarChoiceInput setModalVisible={setModalVisible} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF0F4",
  },
  car_image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  fleet_div: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    padding: 20,
    gap: 8,
    borderRadius: 30,
    letterSpacing: 2,
  },
  fleet_div_text: {
    display: "flex",
  },
  button_container: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  add_button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: 200,
    backgroundColor: "#0B183D",
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
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 100,
    borderRadius: 8,
    width: "94%",
  },
});
