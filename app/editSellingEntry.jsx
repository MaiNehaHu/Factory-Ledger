import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { appColors } from "../constants/appColors";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getTheList() {
  const list = await AsyncStorage.getItem("sold_maal_entry");
  return list !== null ? JSON.parse(list) : [];
}

const editSellingEntry = () => {
  const route = useLocalSearchParams();
  const navigation = useNavigation();
  const { entryKey, dealerkey, dealerName } = route;

  const [response, setResponse] = useState([]);
  const [list, setList] = useState({
    date: "",
    bagsData: [{ rate: 0, totalBags: 0, bagWeight: 0 }],
    paidPayment: 0,
    duePayment: 0,
    totalPayment: 0,
    backDue: 0
  });

  const handleSubmitEditted = async () => {
    if (
      list.date === "" ||
      list.bagsData.some(
        (bag) => bag.rate === 0 || bag.totalBags === 0 || bag.bagWeight === 0
      )
    ) {
      Alert.alert("Please fill all data");
      return;
    }

    try {
      const updatedList = response.map((dealer) => {
        if (dealer.key === dealerkey) {
          const updatedSoldEntry = dealer.soldEntry.map((entry) => {
            if (entry.key === entryKey) {
              return { ...list, key: entryKey };
            }
            return entry;
          });
          return { ...dealer, soldEntry: updatedSoldEntry };
        }
        return dealer;
      });

      await AsyncStorage.setItem(
        "sold_maal_entry",
        JSON.stringify(updatedList)
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error saving edited entry:", error);
    }
  };

  async function callMe() {
    const loadList = async () => {
      const res = await getTheList();
      setResponse(res);
      const dealerData = res.find(dealer => dealer.key === dealerkey);
      if (dealerData) {
        const entryData = dealerData.soldEntry.find(entry => entry.key === entryKey);
        if (entryData) {
          setList(entryData);
        }
      }
    };

    loadList();
  }

  useEffect(() => {
    callMe();
  }, []);

  useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `Edit ${dealerName} Entry` });
    }
  }, [dealerName, navigation]);

  useEffect(() => {
    setList({ ...list, duePayment: list.totalPayment - list.paidPayment + list.backDue });
  }, [list.totalPayment, list.paidPayment, list.backDue]);

  useEffect(() => {
    const totalPayment = list.bagsData.reduce((acc, bag) => acc + (bag.rate * bag.totalBags * bag.bagWeight), 0);
    setList({ ...list, totalPayment });
  }, [list.bagsData]);

  const handleBagsDataChange = (index, field, value) => {
    const newBagsData = list.bagsData.map((bag, i) =>
      i === index ? { ...bag, [field]: parseFloat(value) || 0 } : bag
    );
    setList({ ...list, bagsData: newBagsData });
  };

  const addBagData = () => {
    setList({ ...list, bagsData: [...list.bagsData, { rate: 0, totalBags: 0, bagWeight: 0 }] });
  };

  const removeBagData = (index) => {
    const newBagsData = list.bagsData.filter((_, i) => i !== index);
    setList({ ...list, bagsData: newBagsData });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={list.date}
          onChangeText={(text) => setList({ ...list, date: text })}
          placeholder="Enter date"
        />
      </View>

      {list.bagsData.map((bag, index) => (
        <View key={index} style={styles.bagContainer}>
          <Text style={styles.label}>Rate</Text>
          <TextInput
            style={styles.input}
            value={String(bag.rate)}
            onChangeText={(text) => handleBagsDataChange(index, 'rate', text)}
            keyboardType="numeric"
            placeholder="Enter rate"
          />

          <Text style={styles.label}>Total Bags</Text>
          <TextInput
            style={styles.input}
            value={String(bag.totalBags)}
            onChangeText={(text) => handleBagsDataChange(index, 'totalBags', text)}
            keyboardType="numeric"
            placeholder="Enter total bags"
          />

          <Text style={styles.label}>One Bag Weight (Kg)</Text>
          <TextInput
            style={styles.input}
            value={String(bag.bagWeight)}
            onChangeText={(text) => handleBagsDataChange(index, 'bagWeight', text)}
            keyboardType="numeric"
            placeholder="Enter bag weight"
          />

          <View style={styles.row}>
            <Text style={styles.label}>Total Weight:</Text>
            <Text>{bag.totalBags * bag.bagWeight} KG</Text>
          </View>

          <TouchableOpacity style={styles.removeButton} onPress={() => removeBagData(index)}>
            <Text style={styles.removeButtonText}>Remove Bag</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addBagData}>
        <Text style={styles.addButtonText}>Add Bag</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.label}>Back Due:</Text>
        <TextInput
          style={styles.input}
          value={String(list.backDue)}
          keyboardType="numeric"
          onChangeText={(text) => setList({ ...list, backDue: parseFloat(text) || 0 })}
          placeholder="₹ Enter total payment"
        />
      </View>


      <View style={styles.row}>
        <Text style={styles.label}>Paid Payment:</Text>
        <TextInput
          style={styles.input}
          value={String(list.paidPayment)}
          keyboardType="numeric"
          onChangeText={(text) => setList({ ...list, paidPayment: parseFloat(text) || 0 })}
          placeholder="₹ Enter total payment"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>To Payment:</Text>
        <Text>₹ {list.totalPayment}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Updated Due:</Text>
        <Text>₹ {list.duePayment}</Text>
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmitEditted}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default editSellingEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: appColors.white,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 4,
  },
  dateInput: {
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingVertical: 5,
    borderColor: "#ccc",
    paddingHorizontal: 10,
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
    marginTop: 30,
    width: "100%",
    borderRadius: 10,
    backgroundColor: appColors.yellow,
  },
  submitText: {
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    color: appColors.black,
  },
  row: {
    gap: 10,
    display: "flex",
    flexDirection: "row",
    marginVertical: 2,
    alignItems: "center",
  },
  bagContainer: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: appColors.blue,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center",
    color: appColors.white,
  },
  removeButton: {
    backgroundColor: appColors.red,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: appColors.white,
    textAlign: "center",
    fontSize: 15,
  },
});
