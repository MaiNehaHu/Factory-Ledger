import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { appColors } from "@/constants/appColors";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const newSellingDealer = () => {
  const [dealerName, setDealerName] = useState(""); // State to hold the dealer name
  const [dealerList, setDealerList] = useState([]);
  const [dealerContact, setDealerContact] = useState(); // State to hold the dealer Contact
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (dealerName == "" || !dealerContact) {
      Alert.alert("Enter Valid Details");
      return;
    }

    const newUser = {
      key: uniqueKey(),
      dealerName: dealerName,
      dealerContact: dealerContact,
      soldEntry: [],
    };

    try {
      const updatedList = [newUser, ...dealerList];
      console.log(updatedList);

      await AsyncStorage.setItem("sold_maal_entry", JSON.stringify(updatedList));

      setDealerList(updatedList);
      setDealerName("");
      Alert.alert(dealerName, " added successfully");

      // finally
      setTimeout(() => {
        navigation.navigate("two");
      }, 1000);
    } catch (error) {
      console.error("Error saving dealer:", error);
    }
  };

  function uniqueKey() {
    return `${Math.ceil(Math.random() * Math.pow(10, 4))}`;
  }

  useEffect(() => {
    // Load the list of dealers from AsyncStorage when the component mounts
    const loadDealerList = async () => {
      try {
        const list = await AsyncStorage.getItem("sold_maal_entry");
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
        onChangeText={(text) => setDealerName(text)}
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
        <Text style={styles.submitText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default newSellingDealer;

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
    backgroundColor: appColors.yellow,
    alignSelf: "flex-end",
  },
  submitText: {
    padding: 10,
    fontSize: 15,
    textAlign: "center",
    color: appColors.black,
  },
});
