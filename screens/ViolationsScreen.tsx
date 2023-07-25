import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";
import { Divider } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ViolationsScreen() {
  const [violations, setViolations] = useState<any[] | null>([]);
  const [vehicles, setVehicles] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);

  //https://data.cityofnewyork.us/resource/nc67-uf89.json?$where=amount_due%20%3E%200&plate=T792038C

  useEffect(() => {
    getViolations();
  }, []);

  async function getViolations() {
    let { data: vehicles, error } = await supabase.from("vehicles").select("*");

    try {
      setLoading(true);
      setVehicles(vehicles);
    } catch (error) {
      console.error(error);
    } finally {
      let allViolations = [];

      if (vehicles) {
        for (const vehicle of vehicles) {
          const response = await fetch(
            `https://data.cityofnewyork.us/resource/nc67-uf89.json?$where=amount_due%20%3E%200&plate=${vehicle.plate}`
          );
          const json = await response.json();
          allViolations.push(...json);
        }
      }
      setViolations(allViolations);
      setLoading(false);
    }

    if (error) {
      throw error;
    }
  }

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      {violations?.map((v) => (
        <View style={styles.violation_div} key={v.summons_number}>
          <View style={styles.firstLine}>
            <View style={styles.trafficCircle}>
              <Entypo name="traffic-cone" size={20} color="orange" />
            </View>
            <Text style={styles.boldText}>{v.violation}</Text>
            <Text>${v.amount_due}</Text>
          </View>
          <Divider />
          <View style={styles.secondLine}>
            <View style={styles.lineUnit}>
              <EvilIcons name="credit-card" size={24} color="black" />
              <Text>{v.plate}</Text>
            </View>
            <View style={styles.lineUnit}>
              <EvilIcons name="calendar" size={24} color="black" />
              <Text>{v.issue_date}</Text>
            </View>
            <View style={styles.lineUnit}>
              <EvilIcons name="clock" size={24} color="black" />
              <Text>{v.violation_time}</Text>
            </View>
          </View>

          {/* <View style={styles.firstLine}>
            {v.category == "ezpass" && (
              <>
                <View style={styles.ezpassCircle}>
                  <Text style={styles.circleText}>EZ</Text>
                </View>
                <Text style={styles.boldText}>{v.description}</Text>
                <Text>${v.payment_due}</Text>
              </>
            )}

            {v.category == "traffic" && (
              <>
                <View style={styles.trafficCircle}>
                  <Entypo name="traffic-cone" size={20} color="white" />
                </View>
                <Text style={styles.boldText}>{v.description}</Text>
                <Text>${v.payment_due}</Text>
              </>
            )}

            {v.category == "inspection" && (
              <>
                <View style={styles.inspectionCirlce}>
                  <MaterialCommunityIcons
                    name="car-wrench"
                    size={20}
                    color="white"
                  />
                </View>
                <Text style={styles.boldText}>{v.description}</Text>
                <View style={styles.lineUnit}>
                  <EvilIcons name="credit-card" size={24} color="black" />
                  <Text>{v.plate}</Text>
                </View>
              </>
            )}
          </View>
          {(v.category == "ezpass" || v.category == "traffic") && (
            <>
              <Divider />
              <View style={styles.secondLine}>
                <View style={styles.lineUnit}>
                  <EvilIcons name="credit-card" size={24} color="black" />
                  <Text>{v.plate}</Text>
                </View>
                <View style={styles.lineUnit}>
                  <EvilIcons name="calendar" size={24} color="black" />
                  <Text>{v.date}</Text>
                </View>
                <View style={styles.lineUnit}>
                  <EvilIcons name="clock" size={24} color="black" />
                  <Text>{v.time}</Text>
                </View>
              </View>
            </>
          )} */}
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
  lineUnit: {
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
    backgroundColor: "#0B183D",
    borderRadius: 100,
  },
  inspectionCirlce: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    backgroundColor: "red",
    borderRadius: 100,
  },
  circleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
