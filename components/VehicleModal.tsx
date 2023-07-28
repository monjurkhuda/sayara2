import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { addMonths, addYears, formatDistanceToNow } from "date-fns";

type Props = {
  vehicleid: string | undefined;
};

export default function EmptyFeed({ vehicleid }: Props) {
  const [vehicle, setVehicle] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState<any[] | null>([]);
  const [regExpirations, setRegExpirations] = useState<any[] | null>([]);
  const [dmvInspections, setDmvInspections] = useState<any[] | null>([]);
  const [tlcInspections, setTlcInspections] = useState<any[] | null>([]);
  let allViolations: any[] = [];
  let upcomingRegExpirations: any[] = [];
  let upcomingDmvInspections: any[] = [];
  let upcomingTlcInspections: any[] = [];

  useEffect(() => {
    getVehicle();
  }, []);

  useEffect(() => {
    (async function getVehicleInfo() {
      if (vehicle && vehicle.length > 0) {
        const response = await fetch(
          `https://data.cityofnewyork.us/resource/nc67-uf89.json?$where=amount_due%20%3E%200&plate=${vehicle[0].plate}`
        );
        const json = await response.json();
        allViolations.push(...json);

        var plateNo = vehicle[0]?.plate;
        var today = Date.now();
        var thirtyDaysFromToday = new Date();
        thirtyDaysFromToday.setDate(thirtyDaysFromToday.getDate() + 30);

        //Populating reg expires in < 30 days alerts
        var regExpiresDateParsed = new Date(vehicle[0]?.reg_expires);
        var daysToExpireString = formatDistanceToNow(regExpiresDateParsed, {
          addSuffix: true,
        });

        if (thirtyDaysFromToday > regExpiresDateParsed) {
          upcomingRegExpirations.push({ plateNo, daysToExpireString });
        }

        //Populating dmv inspection in < 30 days alerts
        var lastDmvInspection = new Date(vehicle[0]?.last_dmv_inspection);
        var lastDmvInspectionPlusFourMonths = addMonths(lastDmvInspection, 4);
        var daysTillDmvInspectionString = formatDistanceToNow(
          lastDmvInspectionPlusFourMonths,
          { addSuffix: true }
        );

        if (thirtyDaysFromToday > lastDmvInspectionPlusFourMonths) {
          upcomingDmvInspections.push({
            plateNo,
            daysTillDmvInspectionString,
          });
        }

        //Populating tlc inspection in < 30 days alerts
        var lastTlcInspection = new Date(vehicle[0]?.last_tlc_inspection);
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
      setViolations(allViolations);
      setRegExpirations(upcomingRegExpirations);
      setDmvInspections(upcomingDmvInspections);
      setTlcInspections(upcomingTlcInspections);
      setLoading(false);
    })();
  }, [vehicle]);

  async function getVehicle() {
    try {
      setLoading(true);

      let { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleid);

      if (error) {
        throw error;
      }

      if (data) {
        setVehicle(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      {vehicle && vehicle.length > 0 && (
        <>
          <Text
            style={styles.boldTitle}
          >{`${vehicle[0].make} ${vehicle[0].model} ${vehicle[0].year}`}</Text>
          <View style={styles.lineUnit}>
            <EvilIcons name="credit-card" size={24} color="black" />
            <Text>{vehicle[0]?.plate}</Text>
          </View>
          <View style={styles.lineUnit}>
            <FontAwesome5 name="exclamation-circle" size={16} color="black" />
            <Text>Reg. Expires: {vehicle[0]?.reg_expires}</Text>
          </View>
          <View style={styles.lineUnit}>
            <FontAwesome5 name="wrench" size={16} color="black" />
            <Text>DMV Inspected: {vehicle[0]?.last_dmv_inspection}</Text>
          </View>
          <View style={styles.lineUnit}>
            <FontAwesome5 name="wrench" size={16} color="black" />
            <Text>TLC Inspected: {vehicle[0]?.last_tlc_inspection}</Text>
          </View>
        </>
      )}

      <Divider />

      {violations?.map((v) => (
        <View style={styles.violation_div} key={v.summons_number}>
          <View style={styles.firstLine}>
            <View style={styles.trafficCircle}>
              <Entypo name="traffic-cone" size={20} color="orange" />
            </View>
            <Text style={styles.alert_text}>{v.violation}</Text>
            <Text>${v.amount_due}</Text>
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
            <Text>Reg. expiration {r.daysToExpireString}</Text>
          </View>
        </View>
      ))}

      {dmvInspections?.map((d, i) => (
        <View style={styles.violation_div} key={i}>
          <View style={styles.firstLine}>
            <View style={styles.inspectionCirlce}>
              <MaterialCommunityIcons name="tools" size={20} color="white" />
            </View>
            <Text>DMV inspection due {d.daysTillDmvInspectionString}</Text>
          </View>
        </View>
      ))}

      {tlcInspections?.map((t, i) => (
        <View style={styles.violation_div} key={i}>
          <View style={styles.firstLine}>
            <View style={styles.tlcInspectionCirlce}>
              <MaterialIcons name="taxi-alert" size={20} color="black" />
            </View>
            <Text>TLC inspection due {t.daysTillTlcInspectionString}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginTop: 30,
    marginBottom: 30,
    gap: 10,
    flexWrap: "wrap",
  },
  boldTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  violation_div: {
    display: "flex",
    flexDirection: "column",
    marginTop: 1,
    marginBottom: 1,
    letterSpacing: 2,
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
  alert_text: {
    maxWidth: "70%",
  },
});
