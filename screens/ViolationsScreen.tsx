import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";
import { Divider } from "react-native-elements";
import {
  EvilIcons,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  addMonths,
  addYears,
  formatDistance,
  formatDistanceToNow,
} from "date-fns";
import EmptyFeed from "../components/EmptyFeed";

export default function ViolationsScreen() {
  const [violations, setViolations] = useState<any[] | null>([]);
  const [regExpirations, setRegExpirations] = useState<any[] | null>([]);
  const [dmvInspections, setDmvInspections] = useState<any[] | null>([]);
  const [tlcInspections, setTlcInspections] = useState<any[] | null>([]);
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
      let upcomingRegExpirations = [];
      let upcomingDmvInspections = [];
      let upcomingTlcInspections = [];

      if (vehicles) {
        for (const vehicle of vehicles) {
          const response = await fetch(
            `https://data.cityofnewyork.us/resource/nc67-uf89.json?$where=amount_due%20%3E%200&plate=${vehicle.plate}`
          );
          const json = await response.json();
          allViolations.push(...json);

          var plateNo = vehicle.plate;
          var today = Date.now();
          var thirtyDaysFromToday = new Date();
          thirtyDaysFromToday.setDate(thirtyDaysFromToday.getDate() + 30);

          //Populating reg expires in < 30 days alerts
          var regExpiresDateParsed = new Date(vehicle.reg_expires);
          var daysToExpireString = formatDistanceToNow(regExpiresDateParsed, {
            addSuffix: true,
          });

          if (thirtyDaysFromToday > regExpiresDateParsed) {
            upcomingRegExpirations.push({ plateNo, daysToExpireString });
          }

          //Populating dmv inspection in < 30 days alerts
          var lastDmvInspection = new Date(vehicle.last_dmv_inspection);
          var lastDmvInspectionPlusFourMonths = addMonths(lastDmvInspection, 4);
          var daysTillDmvInspectionString = formatDistanceToNow(
            lastDmvInspectionPlusFourMonths,
            { addSuffix: true }
          );

          if (thirtyDaysFromToday > lastDmvInspectionPlusFourMonths) {
            console.log(lastDmvInspectionPlusFourMonths, lastDmvInspection);
            upcomingDmvInspections.push({
              plateNo,
              daysTillDmvInspectionString,
            });
          }

          //Populating tlc inspection in < 30 days alerts
          var lastTlcInspection = new Date(vehicle.last_tlc_inspection);
          var lastTlcInspectionPlusTwoYears = addYears(lastTlcInspection, 2);
          var daysTillTlcInspectionString = formatDistanceToNow(
            lastTlcInspectionPlusTwoYears,
            { addSuffix: true }
          );

          if (thirtyDaysFromToday > lastTlcInspectionPlusTwoYears) {
            upcomingTlcInspections.push({
              plateNo,
              daysTillTlcInspectionString,
            });
          }
        }
      }
      setViolations(allViolations);
      setRegExpirations(upcomingRegExpirations);
      setDmvInspections(upcomingDmvInspections);
      setTlcInspections(upcomingTlcInspections);
      setLoading(false);
    }

    if (error) {
      throw error;
    }
  }

  if (loading) return <Text>Loading...</Text>;

  if (violations && violations.length < 1)
    return (
      <EmptyFeed message="Add vehicles and EZ-Passes to see violations and alerts." />
    );

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
        </View>
      ))}

      {regExpirations?.map((r, i) => (
        <View style={styles.violation_div} key={i}>
          <View style={styles.firstLine}>
            <View style={styles.registrationCirlce}>
              <MaterialCommunityIcons
                name="file-settings"
                size={20}
                color="white"
              />
            </View>
            <Text style={styles.boldText}>
              Reg. expiration {r.daysToExpireString}
            </Text>
            <View style={styles.lineUnit}>
              <EvilIcons name="credit-card" size={24} color="black" />
              <Text>{r.plateNo}</Text>
            </View>
          </View>
        </View>
      ))}

      {dmvInspections?.map((d, i) => (
        <View style={styles.violation_div} key={i}>
          <View style={styles.firstLine}>
            <View style={styles.inspectionCirlce}>
              <MaterialCommunityIcons name="tools" size={20} color="white" />
            </View>
            <Text style={styles.boldText}>
              DMV inspection due {d.daysTillDmvInspectionString}
            </Text>
            <View style={styles.lineUnit}>
              <EvilIcons name="credit-card" size={24} color="black" />
              <Text>{d.plateNo}</Text>
            </View>
          </View>
        </View>
      ))}

      {tlcInspections?.map((t, i) => (
        <View style={styles.violation_div} key={i}>
          <View style={styles.firstLine}>
            <View style={styles.tlcInspectionCirlce}>
              <MaterialIcons name="taxi-alert" size={20} color="black" />
            </View>
            <Text style={styles.boldText}>
              TLC inspection due {t.daysTillTlcInspectionString}
            </Text>
            <View style={styles.lineUnit}>
              <EvilIcons name="credit-card" size={24} color="black" />
              <Text>{t.plateNo}</Text>
            </View>
          </View>
        </View>
      ))}

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
    marginTop: 6,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 6,
    padding: 12,
    gap: 8,
    borderRadius: 30,
    letterSpacing: 2,
    // shadowColor: "black",
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 1, height: 2 },
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
  registrationCirlce: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    backgroundColor: "orange",
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
  tlcInspectionCirlce: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    backgroundColor: "yellow",
    borderRadius: 100,
    borderWidth: 1,
  },
  circleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
