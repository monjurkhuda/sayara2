import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
import AccountScreen from "../screens/AccountScreen";
import { useState, useEffect } from "react";
import FleetScreen from "../screens/FleetScreen";
import ViolationsScreen from "../screens/ViolationsScreen";
import EzpassesScreen from "../screens/EzpassesScreen";
import { supabase } from "../lib/supabase";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Tab.Navigator
    // screenOptions={{
    //   tabBarStyle: {
    //     backgroundColor: "#0A193D",
    //   },
    //   tabBarActiveTintColor: "white",
    //   tabBarInactiveTintColor: "#615F82",
    // }}
    >
      <Tab.Screen
        name="Violations"
        component={ViolationsScreen}
        options={{
          tabBarLabel: "Violations",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="exclamationcircleo" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Fleet"
        component={FleetScreen}
        options={{
          tabBarLabel: "Fleet",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="car-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="EZ-Passes"
        //component={EzpassesScreen}
        children={() => <EzpassesScreen session={session} />}
        options={{
          tabBarLabel: "EZ-Passes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="ticket-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        //component={AccountScreen}
        children={() => <AccountScreen session={session} />}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          tabBarLabel: "Payments",
          tabBarIcon: ({ color, size }) => (ticket
            <AntDesign name="pay-circle-o1" size={size} color={color} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}
