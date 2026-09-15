import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardStack, ProductoresStack, CampoStack, OperacionesStack } from "./AppStacks";
import CustomTabBar from "./CustomTabBar";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Socios" component={ProductoresStack} />
      <Tab.Screen name="Campo" component={CampoStack} />
      <Tab.Screen name="Operaciones" component={OperacionesStack} />
    </Tab.Navigator>
  );
}
