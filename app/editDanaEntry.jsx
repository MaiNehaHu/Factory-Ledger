import {
  Alert,
  ScrollView,
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
    date,
    danaType,
    bagWeight,
    totalBags,
    totalWeight,
    backDue,
    duePayment,
    paidPayment,
    totalPayment,
  } = route;

  const [response, setResponse] = useState([]);
  const [list, setList] = useState({
    rate,
    date,
    danaType,
    bagWeight,
    totalBags,
    totalWeight,
    backDue,
    paidPayment,
    duePayment,
    totalPayment,
  });

  const handleSubmitEditted = async () => {
    if (
      list.date === "" || list.rate === 0 || list.danaType === ""
    ) {
      Alert.alert("Please fill all data");
      return;
    }

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
    setList({ ...list, totalWeight: parseFloat(list.totalBags) * parseFloat(list.bagWeight) });
  }, [list.totalBags, list.bagWeight]);

  useEffect(() => {
    setList({ ...list, totalPayment: parseFloat(list.rate) * parseFloat(list.totalWeight) });
  }, [list.rate, list.totalWeight]);

  useEffect(() => {
    setList({ ...list, duePayment: parseFloat(list.totalPayment) - parseFloat(list.paidPayment) + parseFloat(list.backDue) });
  }, [list.totalPayment, list.paidPayment, list.backDue]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Date: </Text>
        <TextInput
          style={styles.input}
          value={list.date}
          onChangeText={(text) => setList({ ...list, date: text })}
          placeholder="Enter date"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Dana Type: </Text>
        <TextInput
          style={styles.input}
          value={list.danaType}
          onChangeText={(text) => setList({ ...list, danaType: text })}
          placeholder="Enter dana type"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Rate: </Text>
        <TextInput
          style={styles.input}
          value={String(list.rate)}
          onChangeText={(text) => setList({ ...list, rate: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter rate"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Bags: </Text>
        <TextInput
          style={styles.input}
          value={String(list.totalBags)}
          onChangeText={(text) => setList({ ...list, totalBags: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter total bags"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>1 Bag Weight (Kg): </Text>
        <TextInput
          style={styles.input}
          value={String(list.bagWeight)}
          onChangeText={(text) => setList({ ...list, bagWeight: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter bag weight"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Weight:</Text>
        <Text>{list.totalWeight} KG</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Paid Payment:</Text>
        <TextInput
          style={styles.input}
          value={String(list.paidPayment)}
          keyboardType="numeric"
          onChangeText={(text) => setList({ ...list, paidPayment: parseInt(text) || 0 })}
          placeholder="₹ Enter paid"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Back Due:</Text>
        <TextInput
          style={styles.input}
          value={String(list.backDue)}
          keyboardType="numeric"
          onChangeText={(text) => setList({ ...list, backDue: parseFloat(text) || 0 })}
          placeholder="₹ Enter Back Due"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Payment:</Text>
        <Text>₹ {list.totalPayment}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { fontSize: 17 }]}>Due Payment:</Text>
        <Text style={{ fontWeight: '600', fontSize: 17 }}>₹ {list.duePayment}</Text>
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmitEditted}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
    fontWeight: "600",
    // marginVertical: 8,
  },
  input: {
    width: '50%',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 5,
    // marginBottom: 10,
    paddingVertical: 5,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  submit: {
    marginTop: 10,
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
    marginVertical: 10,
    alignItems: "center",
    justifyContent: 'space-between'
  },
});
