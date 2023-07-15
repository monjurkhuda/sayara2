import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import DatePicker from "@dietime/react-native-date-picker";
import { Button } from "react-native-elements";
import { supabase } from "../lib/supabase";

const CarChoiceInput = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [plate, setPlate] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<Date>();
  const [registrationExpires, setRegistrationExpires] = useState<Date>();
  const [lastInspection, setLastInspection] = useState<Date>();
  const [curr, setCurr] = useState<string>("color");

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
          last_inspection: lastInspection,
        },
      ])
      .select();

    console.log(data);
    console.log(error);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.selectedInfoText}>
        <Text style={{ color: selectedColor }}>{selectedColor}</Text>{" "}
        {year?.getFullYear().toString()} {make} {model} {plate.toUpperCase()}{" "}
      </Text>

      <View style={styles.detailsLine}>
        {curr == "details" && registrationExpires && (
          <Text>
            Reg. Expires: {registrationExpires?.getMonth()}/
            {registrationExpires?.getFullYear()}
          </Text>
        )}

        {curr == "details" && lastInspection && (
          <Text>
            Last Inspection: {lastInspection?.getMonth()}/
            {lastInspection?.getFullYear()}
          </Text>
        )}
      </View>

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
        <>
          <Text>Select Year...</Text>
          <DatePicker
            height={70}
            fontSize={18}
            startYear={1980}
            value={year}
            onChange={(value) => setYear(value)}
            format="yyyy"
          />
        </>
      )}

      {curr == "details" && (
        <TextInput
          style={styles.input}
          onChangeText={setPlate}
          value={plate}
          placeholder="Plate Number"
          placeholderTextColor="gray"
        />
      )}

      {plate && (
        <>
          <Text>Registration Expires</Text>
          <DatePicker
            height={70}
            fontSize={18}
            startYear={2022}
            value={registrationExpires}
            onChange={(value) => setRegistrationExpires(value)}
            format="mm-yyyy"
          />
        </>
      )}

      {registrationExpires && (
        <>
          <Text>Last Inspection</Text>
          <DatePicker
            height={70}
            fontSize={18}
            startYear={2000}
            value={lastInspection}
            onChange={(value) => setLastInspection(value)}
            format="mm-yyyy"
          />
        </>
      )}

      {curr == "info" && year && (
        <Button title={"Next >"} onPress={() => setCurr("details")}></Button>
      )}

      {curr == "details" && lastInspection && (
        <Button title={"Add Car"} onPress={addVehicle}></Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
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
  selectedColorText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedInfoText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsLine: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
});

export default CarChoiceInput;
