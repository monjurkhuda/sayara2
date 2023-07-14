import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ColorChoiceInput = () => {
  const [selectedColor, setSelectedColor] = useState("");

  const colorOptions = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "gray",
    "black",
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Car color:</Text>
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
      {selectedColor !== "" && (
        <Text style={styles.selectedColorText}>
          Selected color: {selectedColor}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
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
});

export default ColorChoiceInput;
