import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { appColors } from "@/constants/appColors";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SoldEntry = () => {
  const navigation = useNavigation();
  const route = useLocalSearchParams();
  const { dealerkey, dealerName } = route;

  const [fetchedList, setFetchedList] = useState([]);
  const [data, setData] = useState({
    date: "",
    bagsData: [{ color: "", rate: 0, totalBags: 0, bagWeight: 0 }],
    paidPayment: 0,
    duePayment: 0,
    totalPayment: 0,
    backDue: 0,
  });

  const loadList = useCallback(async () => {
    try {
      const list = await AsyncStorage.getItem("sold_maal_entry");
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
    if (
      data.date === "" ||
      data.bagsData.some(
        (bag) => bag.rate === 0 || bag.totalBags === 0 || bag.bagWeight === 0
      )
    ) {
      Alert.alert("Please fill all data");
      return;
    }

    try {
      // Create a new object with the entered data and the generated key
      const newEntry = { key: uniqueKey(), ...data };

      // Find the dealer in the fetched list
      const existingDealerIndex = fetchedList.findIndex(
        (dealer) => dealer.key === dealerkey
      );

      if (existingDealerIndex !== -1) {
        fetchedList[existingDealerIndex].soldEntry.push(newEntry);
      }

      await AsyncStorage.setItem(
        "sold_maal_entry",
        JSON.stringify(fetchedList)
      );

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
      bagsData: [...prevData.bagsData, { rate: 0, totalBags: 0, bagWeight: 0 }],
    }));
  };

  const handleRemoveEntry = () => {
    if (data.bagsData.length > 1) {
      setData((prevData) => {
        const newBagsData = [...prevData.bagsData];
        newBagsData.pop();
        return { ...prevData, bagsData: newBagsData };
      });
    }
  };

  function uniqueKey() {
    return `${Math.ceil(Math.random() * Math.pow(10, 5))}`;
  }

  const handleInputChanges = useCallback(() => {
    const totalPayment = data.bagsData.reduce(
      (acc, bag) => acc + bag.rate * bag.totalBags * bag.bagWeight,
      0
    );
    const duePayment = totalPayment - data.paidPayment + data.backDue;

    setData((prevData) => ({
      ...prevData,
      totalPayment,
      duePayment,
    }));
  }, [data.bagsData, data.paidPayment, data.backDue]);

  useEffect(() => {
    handleInputChanges();
  }, [handleInputChanges]);

  useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `${dealerName} Sold Maal Entry` });
    }
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>date:</Text>
        <TextInput
          style={styles.input}
          value={data.date}
          onChangeText={(text) =>
            setData((prevData) => ({ ...prevData, date: text }))
          }
          keyboardType="numeric"
          placeholder="Enter date"
        />
      </View>

      {data.bagsData.map((bag, index) => (
        <View
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            borderBottomWidth: 2,
            borderStyle:'dashed',
            borderColor: appColors.black,
            paddingBottom: 10,
          }}
        >
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                onChangeText={(text) => {
                  const newBagsData = [...data.bagsData];
                  newBagsData[index].color = text;
                  setData((prevData) => ({
                    ...prevData,
                    bagsData: newBagsData,
                  }));
                }}
                keyboardType="default"
                placeholder="Color"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>
                Rate/KG
              </Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                onChangeText={(text) => {
                  const newBagsData = [...data.bagsData];
                  newBagsData[index].rate = text;
                  setData((prevData) => ({
                    ...prevData,
                    bagsData: newBagsData,
                  }));
                }}
                keyboardType="numeric"
                placeholder="Enter rate"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>
                Total Bags
              </Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                onChangeText={(text) => {
                  const newBagsData = [...data.bagsData];
                  newBagsData[index].totalBags = text;
                  setData((prevData) => ({
                    ...prevData,
                    bagsData: newBagsData,
                  }));
                }}
                keyboardType="numeric"
                placeholder="Enter total bags"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>
                1 Bag Wgt.
              </Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                onChangeText={(text) => {
                  const newBagsData = [...data.bagsData];
                  newBagsData[index].bagWeight = text;
                  setData((prevData) => ({
                    ...prevData,
                    bagsData: newBagsData,
                  }));
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
        <Text>{data.totalPayment} Rupees</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Due Payment:</Text>
        <Text>{data.duePayment} Rupees</Text>
      </View>

      <Text style={styles.label}>Paid Payment:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(text) =>
          setData((prevData) => ({
            ...prevData,
            paidPayment: text,
          }))
        }
        placeholder="Enter total payment"
      />

      <Text style={styles.label}>Back Due:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(text) =>
          setData((prevData) => ({ ...prevData, backDue: parseInt(text) }))
        }
        placeholder="Back Due Balance"
      />

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SoldEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor:appColors.white
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
    backgroundColor: appColors.black,
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: appColors.yellow,
  },
});
