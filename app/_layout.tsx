import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { appColors } from "../constants/appColors";
import { Image } from "react-native";

const headerBlueImage = require("@/assets/images/blue-no-bg.png");
const headerImage = require("@/assets/images/icon-no-bg.png");

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          animation: "slide_from_bottom", // Set the animation type
        }}
      >
        {/**Two tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/**Tab one and two are below */}
        <Stack.Screen
          name="addDanaDetails"
          options={{
            title: "Add Material Entry",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
            headerRight: () => (
              <Image
                source={headerImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="addSoldMaalDetails"
          options={{
            title: "Sold Product Entry",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
            headerRight: () => (
              <Image
                source={headerBlueImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />

        {/**Information of the entries are shown in the below pages */}
        <Stack.Screen
          name="danaentryData/[index]"
          options={{
            title: "Material Entry Data",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
            headerRight: () => (
              <Image
                source={headerImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="soldentryData/[index]"
          options={{
            title: "Sold Product Data",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
            headerRight: () => (
              <Image
                source={headerBlueImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />

        {/**Add a new dealer */}
        <Stack.Screen
          name="addDanaDealer"
          options={{
            title: "Add New Dealer",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
            headerRight: () => (
              <Image
                source={headerImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="addSellingDealer"
          options={{
            title: "Add New Dealer",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
            headerRight: () => (
              <Image
                source={headerBlueImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />

        {/**Data Page */}
        <Stack.Screen
          name="danaEntryDataPage"
          options={{
            title: "Entry Data",
            headerStyle: { backgroundColor: appColors.white },
            headerTintColor: appColors.blue,
            headerRight: () => (
              <Image
                source={headerImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="sellingEntryDataPage"
          options={{
            title: "Selling Product Entry",
            headerStyle: { backgroundColor: appColors.white },
            headerTintColor: appColors.black,
            headerRight: () => (
              <Image
                source={headerBlueImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />

        {/*Edit entry   */}
        <Stack.Screen
          name="editDanaEntry"
          options={{
            title: "Edit Entry Data",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
            headerRight: () => (
              <Image
                source={headerImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="editSellingEntry"
          options={{
            title: "Edit Selling Product Entry",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
             headerRight: () => (
              <Image
                source={headerBlueImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />

        {/**Edit dealer data */}
        <Stack.Screen
          name="editDanaDealerData"
          options={{
            title: "Edit Dealer Details",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
            headerRight: () => (
              <Image
                source={headerImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="editSellingDealerData"
          options={{
            title: "Edit Dealer Details",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
            headerRight: () => (
              <Image
                source={headerBlueImage}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
