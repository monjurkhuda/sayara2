import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";
import { Divider } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

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
    <ScrollView style={styles.container}>
      {violations?.map((v) => (
        <View style={styles.violation_div}>
          <View style={styles.firstLine}>
            {v.category == "ezpass" ? (
              <View style={styles.ezpassCircle}>
                <Text style={styles.circleText}>EZ</Text>
              </View>
            ) : (
              <View style={styles.trafficCircle}>
                <Entypo name="traffic-cone" size={20} color="white" />
              </View>
            )}
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
    </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondLineUnit: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
  ezpassCircle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    backgroundColor: "purple",
    borderRadius: 100,
  },
  trafficCircle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    backgroundColor: "gray",
    borderRadius: 100,
  },
  circleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
