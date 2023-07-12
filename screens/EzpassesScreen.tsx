import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function EzpassesScreen() {
  const [ezpasses, setEzpasses] = useState<any[] | null>([]);

  useEffect(() => {
    getEzpasses();
  }, []);

  async function getEzpasses() {
    let { data: ezpasses, error } = await supabase
      .from("ezpasses")
      .select(`*, vehicles(color, make, model, year, plate)`);

    console.log(ezpasses);

    setEzpasses(ezpasses);

    if (error) {
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      {ezpasses?.map((e) => (
        <View style={styles.fleet_div}>
          <View style={styles.fleet_div_text}>
            <Text>{e.number}</Text>
            <Text>
              Vehicle: {e.vehicles.color} {e.vehicles.make} {e.vehicles.model}{" "}
              {e.vehicles.year} ({e.vehicles.plate})
            </Text>
          </View>
        </View>
      ))}
      <Pressable style={styles.add_button}>
        <Text style={styles.add_button_text}>+ Add EZ-Pass</Text>
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
    backgroundColor: "magenta",
  },
  add_button_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
