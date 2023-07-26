import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
  TextInput,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Session } from "@supabase/supabase-js";

export default function EzpassesScreen({ session }: { session: Session }) {
  const [ezpasses, setEzpasses] = useState<any[] | null>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ezNumber, setEzNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [vehicles, setVehicles] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string>();

  useEffect(() => {
    if (session) {
      getEzpasses();
      getVehicles();
    }
  }, [session, modalVisible]);

  async function getEzpasses() {
    // let { data: ezpasses, error } = await supabase
    //   .from("ezpasses")
    //   .select(`*, vehicles(color, make, model, year, plate)`);
    // setEzpasses(ezpasses);
    // if (error) {
    //   throw error;
    // }

    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("ezpasses")
        .select(`*, vehicles(color, make, model, year, plate)`)
        .eq("owner_id", session?.user.id);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setEzpasses(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getVehicles() {
    // let { data: vehicles, error } = await supabase
    //   .from("vehicles")
    //   .select("*")
    //   .eq("owner_id", userid);
    // setVehicles(vehicles);
    // if (error) {
    //   throw error;
    // }

    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("vehicles")
        .select(`*`)
        .eq("owner_id", session?.user.id);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setVehicles(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function addEzpass() {
    const { data, error } = await supabase.from("ezpasses").insert([
      {
        number: ezNumber,
        account_pass: password,
        vehicle_id: selectedVehicle,
        owner_id: session?.user.id,
      },
    ]);

    console.log(error);

    setModalVisible(false);
    setEzNumber("");
    setPassword("");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.button_container}>
        <Pressable style={styles.add_button}>
          <Text
            style={styles.add_button_text}
            onPress={() => setModalVisible(true)}
          >
            + Add EZ-Pass
          </Text>
        </Pressable>
      </View>

      {ezpasses?.map((e) => (
        <View style={styles.fleet_div} key={e.id}>
          <View style={styles.firstLine}>
            <Text style={styles.boldText}>EZ-Pass: {e.number}</Text>
          </View>
          <Divider />
          <View style={styles.secondLine}>
            <View style={styles.lineUnit}>
              <FontAwesome5 name="car-side" size={18} color={e.color} />
              <Text>
                {e.vehicles.make} {e.vehicles.model} {e.vehicles.year}
              </Text>
            </View>
            <View style={styles.lineUnit}>
              <EvilIcons name="credit-card" size={24} color="black" />
              <Text>{e.vehicles.plate}</Text>
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

              <TextInput
                style={styles.input}
                onChangeText={setEzNumber}
                value={ezNumber}
                placeholder="EZ-Pass Number"
                placeholderTextColor="gray"
                keyboardType="numeric"
              />

              {ezNumber && (
                <TextInput
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Account Password"
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  textContentType="oneTimeCode"
                />
              )}

              {password && (
                <>
                  <Text>Choose Car:</Text>
                  <Picker
                    selectedValue={selectedVehicle}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedVehicle(itemValue);
                    }}
                  >
                    {vehicles?.map((v) => (
                      <Picker.Item
                        key={v.id}
                        label={`${v.color} ${v.make} ${v.model} ${v.year}`}
                        value={v.id}
                      />
                    ))}
                  </Picker>
                </>
              )}

              {ezNumber && password && selectedVehicle && (
                <View style={styles.modal_button}>
                  <Button title={"Add EZ-Pass"} onPress={addEzpass}></Button>
                </View>
              )}
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
  fleet_div: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    marginTop: 6,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 6,
    padding: 12,
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
    backgroundColor: "purple",
  },
  add_button_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },

  firstLine: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  secondLine: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  input: {
    height: 50,
    margin: 6,
    borderWidth: 1,
    padding: 10,
  },
  modal_button: {
    backgroundColor: "purple",
    marginTop: 10,
    width: 200,
    alignSelf: "center",
    borderRadius: 30,
  },
});
