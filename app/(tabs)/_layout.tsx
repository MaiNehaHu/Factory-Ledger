import React from "react";
import { Tabs } from "expo-router";
import { appColors } from "@/constants/appColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Image } from "react-native";

const headerBlueImage = require("@/assets/images/blue-no-bg.png");
const headerImage = require("@/assets/images/icon-no-bg.png");

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          height: 65,
          paddingTop: 10,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Imported Materials Entry",
          headerTitleStyle: {
            color: "#fff",
          },
          headerStyle: {
            backgroundColor: appColors.blue,
          },
          headerLeft: () => (
            <Image
              source={headerImage}
              style={{
                width: 50,
                height: "100%",
                marginLeft: 10,
                objectFit: "contain",
              }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="download" color={color} />
          ),
          tabBarActiveTintColor: appColors.blue,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Sold Products Entry",
          headerTitleStyle: {
            color: appColors.black,
          },
          headerStyle: {
            backgroundColor: appColors.yellow,
          },
          headerLeft: () => (
            <Image
              source={headerBlueImage}
              style={{
                width: 50,
                height: "100%",
                marginLeft: 10,
                objectFit: "contain",
              }}
            />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="upload" color={color} />, // Use "cloud-upload" icon for upload
          tabBarActiveTintColor: appColors.yellow,
        }}
      />
    </Tabs>
  );
}
