import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function ViolationsScreen() {
  const [violations, setViolations] = useState<any[] | null>([]);

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
    <View>
      {violations?.map((v) => (
        <View
          style={
            v.category == "ezpass"
              ? styles.toll_violation_tag
              : styles.parking_violation_tag
          }
        >
          <Text>{v.plate}</Text>
          <Text>${v.payment_due}</Text>
          <Text>
            {v.date} {v.time}
          </Text>
          <Text>{v.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  parking_violation_tag: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "yellow",
    margin: 8,
    padding: 8,
    gap: 10,
    borderRadius: 10,
    letterSpacing: 2,
    borderBottomColor: "gold",
    borderBottomWidth: 4,
    fontWeight: "900",
  },
  toll_violation_tag: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#d597ed",
    margin: 8,
    padding: 8,
    gap: 10,
    borderRadius: 10,
    letterSpacing: 2,
    borderBottomColor: "#553C5E",
    borderBottomWidth: 4,
  },
});
