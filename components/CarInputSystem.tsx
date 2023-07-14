import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface CarInputSystemProps {}

const CarInputSystem: React.FC<CarInputSystemProps> = () => {
  const [make, onChangeMake] = useState<string>("");
  const [model, onChangeModel] = useState<string>("");
  const [year, onChangeYear] = useState<string>("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeMake}
        value={make}
        placeholder="Car Make"
        placeholderTextColor="gray"
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangeModel}
        value={model}
        placeholder="Car Model"
        placeholderTextColor="gray"
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangeYear}
        value={year}
        placeholder="Car Year"
        keyboardType="number-pad"
        placeholderTextColor="gray"
      />

      <Text style={styles.selectedInfoText}>
        Selected: {make} - {model} - {year}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  pickerContainer: {
    height: 40,
    marginBottom: 20,
  },
  picker: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "gray",
  },
  dropDownPicker: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "gray",
  },
  pickerItem: {
    justifyContent: "flex-start",
  },
  selectedInfoText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CarInputSystem;
