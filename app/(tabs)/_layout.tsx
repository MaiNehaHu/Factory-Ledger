import React from "react";
import { Tabs } from "expo-router";
import { appColors } from "@/constants/appColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dana Entry",
          headerTitleStyle: {
            color: "#fff",
          },
          headerStyle: {
            backgroundColor: appColors.blue,
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="download" color={color} />
          ),
          tabBarActiveTintColor: appColors.blue,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Sold Maal Entry",
          headerTitleStyle: {
            color: appColors.black,
          },
          headerStyle: {
            backgroundColor: appColors.yellow,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="upload" color={color} />, // Use "cloud-upload" icon for upload
          tabBarActiveTintColor: appColors.yellow,
        }}
      />
    </Tabs>
  );
}
