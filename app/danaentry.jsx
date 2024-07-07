import React, { useEffect, useState } from "react";
import { appColors } from "@/constants/appColors";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";

const DanaEntry = () => {
  const navigation = useNavigation();
  const route = useLocalSearchParams();
  const { dealerName } = route;

  const [fetchedList, setFetchedList] = useState([]);
  const [data, setData] = useState({
    rate: 0,
    date: "",
    danaType: "",
    bagWeight: 0,
    totalBags: 0,
    backDue: 0,
    duePayment: 0,
    totalWeight: 0,
    paidPayment: 0,
    totalPayment: 0,
  });

  const handleSubmit = async () => {
    if (
      data.date === "" || data.rate === 0 || data.danaType === ""
    ) {
      Alert.alert("Please fill all data");
      return;
    }

    try {
      // Create a new object with the entered data and the generated key
      const newDataEntry = { key: uniqueKey(), ...data };

      // Find the dealer in the fetched list
      const existingDealerIndex = fetchedList.findIndex(
        (dealer) => dealer.dealerName === dealerName
      );

      if (existingDealerIndex !== -1) {
        fetchedList[existingDealerIndex].danaEntry.push(newDataEntry);
      }

      // Save the updated fetched list to AsyncStorage
      await AsyncStorage.setItem("dana_entry", JSON.stringify(fetchedList));

      Alert.alert("Added successfully");

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error("Error handling submit:", error);
      // Handle error here, e.g., display an error message to the user
    }
  };

  function uniqueKey() {
    return `${Math.ceil(Math.random() * Math.pow(10, 5))}`;
  }

  useEffect(() => {
    const loadList = async () => {
      try {
        const list = await AsyncStorage.getItem("dana_entry");
        if (list !== null) {
          setFetchedList(JSON.parse(list));
        }
      } catch (error) {
        console.error("Error loading dealer list:", error);
      }
    };

    loadList();
  }, []);

  useEffect(() => {
    setData({ ...data, totalWeight: data.totalBags * data.bagWeight });
  }, [data.totalBags, data.bagWeight]);

  useEffect(() => {
    setData({ ...data, totalPayment: data.rate * data.totalWeight });
  }, [data.rate, data.totalWeight]);

  useEffect(() => {
    setData({ ...data, duePayment: data.totalPayment - data.paidPayment + data.backDue });
  }, [data.totalPayment, data.paidPayment, data.backDue]);

  React.useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `${dealerName} Dana Entry` });
    }
  }, [dealerName, navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          value={data.date}
          onChangeText={(text) => setData({ ...data, date: text })}
          placeholder="Enter date"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Dana Type: </Text>
        <TextInput
          style={styles.input}
          value={data.danaType}
          onChangeText={(text) => setData({ ...data, danaType: text })}
          placeholder="Enter dana type"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Rate: </Text>
        <TextInput
          style={styles.input}
          value={data.rate}
          onChangeText={(text) => setData({ ...data, rate: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter rate"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Bags: </Text>
        <TextInput
          style={styles.input}
          value={data.totalBags}
          onChangeText={(text) => setData({ ...data, totalBags: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter total bags"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>One Bag Weight (Kg): </Text>
        <TextInput
          style={styles.input}
          value={data.bagWeight}
          onChangeText={(text) => setData({ ...data, bagWeight: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter bag weight"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Weight: </Text>
        <Text>{data.totalWeight} KG</Text>
      </View>


      <View style={styles.row}>
        <Text style={styles.label}>Paid Payment: </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(text) => setData({ ...data, paidPayment: parseInt(text) || 0 })}
          placeholder="₹ Enter paid"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Back Due: </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(text) => setData({ ...data, backDue: parseInt(text) || 0 })}
          placeholder="Enter backDue"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Payment: </Text>
        <Text>₹ {data.totalPayment}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { fontSize: 17 }]}>Updated Due Payment:</Text>
        <Text style={{ fontWeight: '600', fontSize: 17 }}>₹ {data.duePayment}</Text>
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: appColors.white,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginVertical: 8,
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

export default DanaEntry;
