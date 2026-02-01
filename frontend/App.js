import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WeightScreen from "./Tabs/weight";
import WorkoutScreen from "./Tabs/workout";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Weight"
        screenOptions={{

          headerShown: false,
          tabBarStyle: {
            backgroundColor: "rgb(30,38,68)",
            height: 80,
            flexDirection: "row",
            paddingTop: 10,
            borderTopColor: "rgb(30,38,68)",
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
        }}
      >
        <Tab.Screen
          name="Weight"
          component={WeightScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "scale" : "scale-outline"}
                size={focused ? 30 : 26}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Workout"
          component={WorkoutScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "barbell" : "barbell-outline"}
                size={focused ? 30 : 26}
                color={color}
              />
            ),
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}