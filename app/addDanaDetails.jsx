import React, { useEffect, useState, useCallback } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { appColors } from "@/constants/appColors";

const AddDanaDetails = () => {
  const navigation = useNavigation();
  const route = useLocalSearchParams();
  const { dealerName, dealerkey } = route;

  const [fetchedList, setFetchedList] = useState([]);
  const [data, setData] = useState({
    date: "",
    danaEntries: [{ danaType: "", rate: 0, totalBags: 0, bagWeight: 0 }],
    paidPayment: 0,
    duePayment: 0,
    totalPayment: 0,
    backDue: 0,
  });

  const loadList = useCallback(async () => {
    try {
      const list = await AsyncStorage.getItem("dana_entry");
      if (list !== null) {
        setFetchedList(JSON.parse(list));
      }
    } catch (error) {
      console.error("Error loading dealer list:", error);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleSubmit = async () => {
    if (data.date === "" || data.danaEntries.some((entry) => entry.danaType === "" || entry.rate === 0 || entry.totalBags === 0 || entry.bagWeight === 0)) {
      Alert.alert("Please fill all data");
      return;
    }

    try {
      // Create a new object with the entered data and the generated key
      const newDataEntry = { key: uniqueKey(), ...data };

      // Find the dealer in the fetched list
      const existingDealerIndex = fetchedList.findIndex(
        (dealer) => dealer.key === dealerkey
      );

      if (existingDealerIndex !== -1) {
        fetchedList[existingDealerIndex].danaEntry.push(newDataEntry);
      }
      console.log(newDataEntry);

      // Save the updated fetched list to AsyncStorage
      await AsyncStorage.setItem("dana_entry", JSON.stringify(fetchedList));

      Alert.alert("Added successfully");

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  const handleAddEntry = () => {
    setData((prevData) => ({
      ...prevData,
      danaEntries: [...prevData.danaEntries, { danaType: "", rate: 0, totalBags: 0, bagWeight: 0 }],
    }));
  };

  const handleRemoveEntry = () => {
    if (data.danaEntries.length > 1) {
      setData((prevData) => {
        const newEntries = [...prevData.danaEntries];
        newEntries.pop();
        return { ...prevData, danaEntries: newEntries };
      });
    }
  };

  function uniqueKey() {
    return `${Math.ceil(Math.random() * Math.pow(10, 5))}`;
  }

  const handleInputChanges = useCallback(() => {
    const totalPayment = data.danaEntries.reduce(
      (acc, entry) => acc + entry.rate * entry.totalBags * entry.bagWeight,
      0
    );
    const duePayment = totalPayment - data.paidPayment + data.backDue;

    setData((prevData) => ({
      ...prevData,
      totalPayment,
      duePayment,
    }));
  }, [data.danaEntries, data.paidPayment, data.backDue]);

  useEffect(() => {
    handleInputChanges();
  }, [handleInputChanges]);

  useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `${dealerName}'s Materials Imported` });
    }
  }, [navigation, dealerName]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          value={data.date}
          onChangeText={(text) => setData((prevData) => ({ ...prevData, date: text }))}
          placeholder="Enter date"
        />
      </View>

      {data.danaEntries.map((entry, index) => (
        <View key={index} style={{ display: "flex", flexDirection: "column", borderBottomWidth: 2, borderStyle: 'dashed', borderColor: appColors.black, paddingBottom: 10 }}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Dana Type</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={entry.danaType}
                onChangeText={(text) => {
                  const newEntries = [...data.danaEntries];
                  newEntries[index].danaType = text;
                  setData((prevData) => ({ ...prevData, danaEntries: newEntries }));
                }}
                placeholder="Enter dana type"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Rate/KG</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={String(entry.rate)}
                onChangeText={(text) => {
                  const newEntries = [...data.danaEntries];
                  newEntries[index].rate = parseInt(text) || 0;
                  setData((prevData) => ({ ...prevData, danaEntries: newEntries }));
                }}
                keyboardType="numeric"
                placeholder="Enter rate"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Total Bags</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={String(entry.totalBags)}
                onChangeText={(text) => {
                  const newEntries = [...data.danaEntries];
                  newEntries[index].totalBags = parseInt(text) || 0;
                  setData((prevData) => ({ ...prevData, danaEntries: newEntries }));
                }}
                keyboardType="numeric"
                placeholder="Enter total bags"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>1 Bag Weight</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={String(entry.bagWeight)}
                onChangeText={(text) => {
                  const newEntries = [...data.danaEntries];
                  newEntries[index].bagWeight = parseInt(text) || 0;
                  setData((prevData) => ({ ...prevData, danaEntries: newEntries }));
                }}
                keyboardType="numeric"
                placeholder="Enter bag weight"
              />
            </View>
          </View>
        </View>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={handleRemoveEntry}>
          <Text style={styles.addButtonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total:</Text>
        <Text>₹ {data.totalPayment}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Due Payment:</Text>
        <Text>₹ {data.duePayment}</Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'col', width: '100%' }}>
        <Text style={styles.label}>Paid Payment:</Text>
        <TextInput
          style={styles.input}
          value={String(data.paidPayment)}
          onChangeText={(text) => setData((prevData) => ({ ...prevData, paidPayment: parseInt(text) || 0 }))}
          keyboardType="numeric"
          placeholder="Enter paid payment"
        />
      </View>

      <View style={{ display: 'flex', flexDirection: 'col', width: '100%' }}>
        <Text style={styles.label}>Back Due:</Text>
        <TextInput
          style={styles.input}
          value={String(data.backDue)}
          onChangeText={(text) => setData((prevData) => ({ ...prevData, backDue: parseInt(text) || 0 }))}
          keyboardType="numeric"
          placeholder="Enter back due"
        />
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddDanaDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: appColors.white
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
    width: "100%",
    marginTop: 10,
    marginBottom: 40,
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
  col: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    width: "48%",
  },
  buttonRow: {
    gap: 10,
    top: 0,
    right: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.blue,
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: appColors.white,
  },
});
