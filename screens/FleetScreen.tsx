import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { supabase } from "../lib/supabase";

export default function FleetScreen() {
  const [vehicles, setVehicles] = useState<any[] | null>([]);

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
              {v.make} {v.model} {v.year}
            </Text>
            <Text>
              {v.date} {v.time}
            </Text>
            <Text>Reg. Expires: {v.reg_expires}</Text>
          </View>
        </View>
      ))}
      <Pressable style={styles.add_button}>
        <Text style={styles.add_button_text}>+ Add Vehicle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
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
});
