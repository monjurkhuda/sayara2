import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  message: string;
};

export default function EmptyFeed({ message }: Props) {
  return (
    <View style={styles.container}>
      <AntDesign name="rest" size={60} color="gray" />
      <Text style={styles.empty_feed_text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    gap: 10,
  },
  empty_feed_text: {
    display: "flex",
    fontWeight: "500",
    color: "gray",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    textAlign: "center",
    fontSize: 14,
  },
});
