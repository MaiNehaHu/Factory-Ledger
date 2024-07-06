import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { appColors } from "../constants/appColors";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getTheList() {
  const list = await AsyncStorage.getItem("dana_entry");
  return list !== null ? JSON.parse(list) : [];
}

const editDanaEntry = () => {
  const route = useLocalSearchParams();
  const navigation = useNavigation();
  const {
    entryKey,
    dealerkey,
    dealerName,
    rate,
    danaType,
    bagWeight,
    totalBags,
    totalWeight,
    duePayment,
    paidPayment,
    totalPayment,
  } = route;

  const [response, setResponse] = useState([]);
  const [list, setList] = useState({
    rate,
    date: "",
    danaType,
    bagWeight,
    totalBags,
    totalWeight,
    paidPayment,
    duePayment,
    totalPayment,
  });

  const handleSubmitEditted = async () => {
    try {
      const updatedList = response.map((dealer) => {
        if (dealer.key === dealerkey) {
          const updatedDanaEntry = dealer.danaEntry.map((entry) => {
            if (entry.key === entryKey) {
              return { ...list, key: entryKey };
            }
            return entry;
          });
          return { ...dealer, danaEntry: updatedDanaEntry };
        }
        return dealer;
      });

      await AsyncStorage.setItem("dana_entry", JSON.stringify(updatedList));
      navigation.goBack();
    } catch (error) {
      console.error("Error saving edited entry:", error);
    }
  };

  async function callMe() {
    const loadList = async () => {
      const res = await getTheList();
      setResponse(res);
    };

    loadList();
  }

  React.useEffect(() => {
    callMe();
  }, []);

  React.useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `Edit ${dealerName} Entry` });
    }
  }, [dealerName, navigation]);

  useEffect(() => {
    setList({ ...list, totalWeight: list.totalBags * list.bagWeight });
  }, [list.totalBags, list.bagWeight]);

  useEffect(() => {
    setList({ ...list, totalPayment: list.rate * list.totalWeight });
  }, [list.rate, list.totalWeight]);

  useEffect(() => {
    setList({ ...list, duePayment: list.totalPayment - list.paidPayment });
  }, [list.totalPayment, list.paidPayment]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <TextInput
        style={styles.input}
        value={list.date}
        onChangeText={(text) => setList({ ...list, date: text })}
        placeholder="Enter date"
      />
      </View>

      <Text style={styles.label}>Dana Type</Text>
      <TextInput
        style={styles.input}
        value={list.danaType}
        onChangeText={(text) => setList({ ...list, danaType: text })}
        placeholder="Enter dana type"
      />

      <Text style={styles.label}>Rate</Text>
      <TextInput
        style={styles.input}
        value={list.rate}
        onChangeText={(text) => setList({ ...list, rate: text })}
        keyboardType="numeric"
        placeholder="Enter rate"
      />

      <Text style={styles.label}>Total Bags</Text>
      <TextInput
        style={styles.input}
        value={list.totalBags}
        onChangeText={(text) => setList({ ...list, totalBags: text })}
        keyboardType="numeric"
        placeholder="Enter total bags"
      />

      <Text style={styles.label}>One Bag Weight (Kg)</Text>
      <TextInput
        style={styles.input}
        value={list.bagWeight}
        onChangeText={(text) => setList({ ...list, bagWeight: text })}
        keyboardType="numeric"
        placeholder="Enter bag weight"
      />

      <View style={styles.row}>
        <Text style={styles.label}>Total Weight:</Text>
        <Text>{list.totalWeight} KG</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Payment:</Text>
        <Text>₹ {list.totalPayment}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Due Payment:</Text>
        <Text>₹ {list.duePayment}</Text>
      </View>

      <Text style={styles.label}>Paid Payment</Text>
      <TextInput
        style={styles.input}
        value={list.paidPayment}
        keyboardType="numeric"
        onChangeText={(text) => setList({ ...list, paidPayment: text })}
        placeholder="₹ Enter total payment"
      />

      <TouchableOpacity style={styles.submit} onPress={handleSubmitEditted}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default editDanaEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: appColors.white,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingVertical: 5,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  submit: {
    marginTop: 50,
    width: "100%",
    borderRadius: 10,
    backgroundColor: appColors.blue,
  },
  submitText: {
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    color: appColors.white,
  },
  row: {
    gap: 10,
    display: "flex",
    flexDirection: "row",
    marginVertical: 2,
    alignItems: "center",
  },
});
