import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { appColors } from "../constants/appColors";

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
          name="danaentry"
          options={{
            title: "Add Dana Entry",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
          }}
        />
        <Stack.Screen
          name="soldentry"
          options={{
            title: "Sold Maal Entry",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
          }}
        />

        {/**Information of the entries are shown in the below pages */}
        <Stack.Screen
          name="danaentryData/[index]"
          options={{
            title: "Dana Entry Data",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
          }}
        />
        <Stack.Screen
          name="soldentryData/[index]"
          options={{
            title: "Sold Maal Data",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
          }}
        />

        {/**Add a new dealer */}
        <Stack.Screen
          name="newDanaDealer"
          options={{
            title: "Add New Dealer",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
          }}
        />
        <Stack.Screen
          name="newSellingDealer"
          options={{
            title: "Add New Dealer",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
          }}
        />
        <Stack.Screen
          name="danaEntryDataPage"
          options={{
            title: "Entry Data",
            headerStyle: { backgroundColor: appColors.white },
            headerTintColor: appColors.blue,
          }}
        />
        <Stack.Screen
          name="editDanaEntry"
          options={{
            title: "Edit Entry Data",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
          }}
        />
        <Stack.Screen
          name="sellingEntryDataPage"
          options={{
            title: "Selling Maal Entry",
            headerStyle: { backgroundColor: appColors.white },
            headerTintColor: appColors.black,
          }}
        />
        <Stack.Screen
          name="editSellingEntry"
          options={{
            title: "Edit Selling Maal Entry",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
          }}
        />
        <Stack.Screen
          name="editDanaDealerData"
          options={{
            title: "Edit Dealer Details",
            headerStyle: { backgroundColor: appColors.blue },
            headerTintColor: appColors.white,
          }}
        />
        <Stack.Screen
          name="editSellingDealerData"
          options={{
            title: "Edit Dealer Details",
            headerStyle: { backgroundColor: appColors.yellow },
            headerTintColor: appColors.black,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
