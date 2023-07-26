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
import { FontAwesome5 } from "@expo/vector-icons";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";

export default function FleetScreen() {
  const [vehicles, setVehicles] = useState<any[] | null>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getVehicles();
  }, [vehicles]);

  async function getVehicles() {
    let { data: vehicles, error } = await supabase.from("vehicles").select("*");

    setVehicles(vehicles);

    if (error) {
      throw error;
    }
  }

  return (
    <ScrollView style={styles.container}>
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

      {vehicles?.map((v) => (
        <View style={styles.fleet_div} key={v.id}>
          <View style={styles.firstLine}>
            <View
              style={{
                backgroundColor: v.color == "white" ? "black" : "white",
              }}
            >
              <Ionicons name="ios-car-sport-sharp" size={22} color={v.color} />
              {/* <FontAwesome5 name="car-side" size={18} color={v.color} /> */}
            </View>
            <Text style={styles.boldText}>
              {v.make} {v.model} {v.year}
            </Text>
            <View style={styles.lineUnit}>
              <EvilIcons name="credit-card" size={24} color="black" />
              <Text>{v.plate}</Text>
            </View>
          </View>
          <Divider />
          <View style={styles.secondLine}>
            <View style={styles.lineUnit}>
              <FontAwesome5 name="exclamation-circle" size={16} color="black" />
              <Text>Reg. Expires: {v.reg_expires}</Text>
            </View>
            <View style={styles.lineUnit}>
              <FontAwesome5 name="wrench" size={16} color="black" />
              <Text>DMV Inspected: {v.last_dmv_inspection}</Text>
            </View>
          </View>
        </View>
      ))}

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
    width: "98%",
    alignItems: "flex-end",
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

  firstLine: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  secondLine: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  lineUnit: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  violation_div: {
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
    // shadowColor: "black",
    // shadowOpacity: 0.04,
    // shadowOffset: { width: 0, height: 2 },
  },
  boldText: {
    flex: 1,
    fontWeight: "700",
  },
  circleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
