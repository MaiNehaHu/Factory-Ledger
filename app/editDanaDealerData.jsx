import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { appColors } from "../constants/appColors";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const editDanaDealerData = () => {
  const navigation = useNavigation();
  const route = useLocalSearchParams();
  const { key, name, number } = route;
  const [dealerList, setDealerList] = useState([]);
  const [dealerName, setDealerName] = useState(name); // State to hold the dealer name
  const [dealerContact, setDealerContact] = useState(number); // State to hold the dealer Contact

  const handleSubmit = async () => {
    if (dealerName == "" || !dealerContact) {
      Alert.alert("Please Enter Valid Details");
      return;
    }

    try {
      const dealerIndex = dealerList.findIndex((item) => item.key === key);
      const updatedDealerList = [...dealerList];

      if (dealerIndex !== -1) {
        // Update the dealer details if the dealer is found
        updatedDealerList[dealerIndex] = {
          ...updatedDealerList[dealerIndex],
          dealerName: dealerName,
          dealerContact: dealerContact,
        };
      }

      await AsyncStorage.setItem(
        "dana_entry",
        JSON.stringify(updatedDealerList)
      );

      setDealerList(updatedDealerList);
      setDealerName("");
      setDealerContact();
      Alert.alert(dealerName, " saved successfully");

      // finally
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error("Error saving dealer:", error);
    }
  };

  useEffect(() => {
    // Load the list of dealers from AsyncStorage when the component mounts
    const loadDealerList = async () => {
      try {
        const list = await AsyncStorage.getItem("dana_entry");
        if (list !== null) {
          setDealerList(JSON.parse(list));
        }
      } catch (error) {
        console.error("Error loading dealer list:", error);
      }
    };

    loadDealerList();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dealer Name</Text>
      <TextInput
        style={styles.input}
        value={dealerName}
        onChangeText={setDealerName}
        placeholder="Example: Rajeev Bhai"
      />
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={dealerContact}
        onChangeText={setDealerContact}
        placeholder="9897969594"
        maxLength={10}
      />

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default editDanaDealerData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submit: {
    width: "50%",
    borderRadius: 10,
    backgroundColor: appColors.blue,
    alignSelf: "flex-end",
  },
  submitText: {
    padding: 10,
    fontSize: 15,
    textAlign: "center",
    color: appColors.white,
  },
});
