import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";
import { Divider } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

export default function ViolationsScreen() {
  const [violations, setViolations] = useState<any[] | null>([]);

  //https://data.cityofnewyork.us/resource/nc67-uf89.json?$where=amount_due%20%3E%200&plate=T792038C

  useEffect(() => {
    getViolations();
  }, []);

  async function getViolations() {
    let { data: violations, error } = await supabase
      .from("violations")
      .select("*");

    setViolations(violations);

    if (error) {
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      {violations?.map((v) => (
        <View style={styles.violation_div}>
          <View style={styles.firstLine}>
            <View
              style={
                v.category == "ezpass"
                  ? styles.ezpassCircle
                  : styles.trafficCircle
              }
            >
              <Text style={styles.circleText}>EZ</Text>
            </View>
            <Text style={styles.boldText}>{v.description}</Text>
            <Text>${v.payment_due}</Text>
          </View>
          <Divider />
          <View style={styles.secondLine}>
            <View style={styles.secondLineUnit}>
              <EvilIcons name="credit-card" size={24} color="black" />
              <Text>{v.plate}</Text>
            </View>
            <View style={styles.secondLineUnit}>
              <EvilIcons name="calendar" size={24} color="black" />
              <Text>{v.date}</Text>
            </View>
            <View style={styles.secondLineUnit}>
              <EvilIcons name="clock" size={24} color="black" />
              <Text>{v.time}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF0F4",
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
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  secondLineUnit: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  violation_div: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F7F6F9",
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    padding: 20,
    gap: 10,
    borderRadius: 30,
    letterSpacing: 2,
  },
  boldText: {
    fontWeight: "700",
  },
  ezpassCircle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    backgroundColor: "purple",
    borderRadius: 100,
  },
  trafficCircle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    backgroundColor: "gray",
    borderRadius: 100,
  },
  circleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
