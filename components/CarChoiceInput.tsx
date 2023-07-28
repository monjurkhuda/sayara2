import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import DatePicker from "@dietime/react-native-date-picker";
import { Button, Divider } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { EvilIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { format } from "date-fns";

const CarChoiceInput = ({ setModalVisible }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [plate, setPlate] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<Date>();
  const [registrationExpires, setRegistrationExpires] = useState<Date>();
  const [lastDmvInspection, setLastDmvInspection] = useState<Date>();
  const [lastTlcInspection, setLastTlcInspection] = useState<Date>();
  const [curr, setCurr] = useState<string>("color");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const colorOptions = [
    "black",
    "white",
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "gray",
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCurr("info");
  };

  async function addVehicle() {
    const { data, error } = await supabase
      .from("vehicles")
      .insert([
        {
          color: selectedColor,
          make: make,
          model: model,
          year: year?.getFullYear().toString(),
          plate: plate.toUpperCase(),
          reg_expires: registrationExpires,
          last_dmv_inspection: lastDmvInspection,
          last_tlc_inspection: lastTlcInspection,
          owner_id: session?.user.id,
        },
      ])
      .select();

    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.carInfoLine}>
        <View
          style={{
            backgroundColor: selectedColor == "white" ? "black" : "white",
            borderRadius: 20,
            padding: 6,
          }}
        >
          <Ionicons
            name="ios-car-sport-sharp"
            size={22}
            color={selectedColor}
          />
        </View>
        <Text style={styles.selectedInfoText}>
          {year?.getFullYear().toString()} {make} {model} {plate.toUpperCase()}{" "}
        </Text>
      </View>

      <Divider style={{ width: "100%" }} />
      {curr == "color" && (
        <>
          <Text style={styles.label}>Select Color:</Text>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  selectedColor === color && styles.selectedColorOption,
                ]}
                onPress={() => handleColorSelect(color)}
              >
                <View
                  style={[styles.colorOptionCircle, { backgroundColor: color }]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      {curr == "info" && (
        <TextInput
          style={styles.input}
          onChangeText={setMake}
          value={make}
          placeholder="Car Make"
          placeholderTextColor="gray"
        />
      )}
      {curr == "info" && make && (
        <TextInput
          style={styles.input}
          onChangeText={setModel}
          value={model}
          placeholder="Car Model"
          placeholderTextColor="gray"
        />
      )}

      {curr == "info" && model && (
        <TextInput
          style={styles.input}
          onChangeText={setPlate}
          value={plate}
          placeholder="Plate Number"
          placeholderTextColor="gray"
        />
      )}

      {curr == "carYear" && (
        <>
          <Text>Select Year...</Text>
          <DatePicker
            height={70}
            fontSize={18}
            startYear={1980}
            endYear={2030}
            value={year}
            onChange={(value) => setYear(value)}
            format="yyyy"
          />
        </>
      )}

      {curr == "regExpires" && (
        <>
          <Text>Registration Expires</Text>
          <DatePicker
            height={70}
            fontSize={18}
            startYear={2020}
            endYear={2030}
            value={registrationExpires}
            onChange={(value) => setRegistrationExpires(value)}
            format="mm-yyyy"
          />
        </>
      )}

      {curr == "lastDmvInsp" && (
        <>
          <Text>Last DMV Inspection</Text>
          <DatePicker
            height={70}
            fontSize={18}
            startYear={2000}
            endYear={2030}
            value={lastDmvInspection}
            onChange={(value) => setLastDmvInspection(value)}
            format="mm-dd-yyyy"
          />
        </>
      )}

      {curr == "lastTlcInsp" && (
        <>
          <Text>Last TLC Inspection</Text>
          <DatePicker
            height={70}
            fontSize={18}
            startYear={2000}
            endYear={2030}
            value={lastTlcInspection}
            onChange={(value) => setLastTlcInspection(value)}
            format="mm-dd-yyyy"
          />
        </>
      )}

      {curr == "info" && plate && (
        <Button title={"Next >"} onPress={() => setCurr("carYear")}></Button>
      )}

      {curr == "carYear" && year && (
        <Button title={"Next >"} onPress={() => setCurr("regExpires")}></Button>
      )}

      {curr == "regExpires" && registrationExpires && (
        <Button
          title={"Next >"}
          onPress={() => setCurr("lastDmvInsp")}
        ></Button>
      )}

      {curr == "lastDmvInsp" && lastDmvInspection && (
        <Button
          title={"Next >"}
          onPress={() => setCurr("lastTlcInsp")}
        ></Button>
      )}

      {curr == "lastTlcInsp" && lastTlcInspection && (
        <Button title={"Add Car"} onPress={addVehicle}></Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  carInfoLine: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "90%",
    height: 50,
    margin: 6,
    borderWidth: 1,
    padding: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  colorOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "gray",
  },
  selectedColorOption: {
    borderColor: "black",
    borderWidth: 3,
  },
  colorOptionCircle: {
    width: 20,
    height: 20,
    borderRadius: 25,
  },
  selectedInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  detailsLine: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

export default CarChoiceInput;
