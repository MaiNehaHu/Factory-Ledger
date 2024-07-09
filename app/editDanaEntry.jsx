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
  const { entryKey, dealerkey, dealerName } = route;

  const [response, setResponse] = useState([]);
  const [list, setList] = useState({
    date: "",
    danaEntries: [{ danaType: "", rate: 0, totalBags: 0, bagWeight: 0 }],
    paidPayment: 0,
    duePayment: 0,
    totalPayment: 0,
    backDue: 0,
  });

  const handleSubmitEditted = async () => {
    if (
      list.date === "" ||
      list.danaEntries.some(
        (bag) => bag.rate === 0 || bag.totalBags === 0 || bag.bagWeight === 0
      )
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
      const dealerData = res.find((dealer) => dealer.key === dealerkey);
      if (dealerData) {
        const entryData = dealerData.danaEntry.find(
          (entry) => entry.key === entryKey
        );
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
      navigation.setOptions({ title: `Edit ${dealerName} Dana Entry` });
    }
  }, [dealerName, navigation]);

  useEffect(() => {
    const totalPayment = list.danaEntries.reduce(
      (acc, entry) => acc + entry.rate * entry.totalBags * entry.bagWeight,
      0
    );
    setList({ ...list, totalPayment });
  }, [list.danaEntries]);

  useEffect(() => {
    setList({
      ...list,
      duePayment:
        parseFloat(list.totalPayment) -
        parseFloat(list.paidPayment) +
        parseFloat(list.backDue),
    });
  }, [list.totalPayment, list.paidPayment, list.backDue]);

  const handleDanaEntriesChange = (index, field, value) => {
    const newDanaEntries = list.danaEntries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setList({ ...list, danaEntries: newDanaEntries });
  };

  const addDanaEntry = () => {
    setList({
      ...list,
      danaEntries: [
        ...list.danaEntries,
        { danaType: "", rate: 0, totalBags: 0, bagWeight: 0 },
      ],
    });
  };

  const removeDanaEntry = (index) => {
    const newDanaEntries = list.danaEntries.filter((_, i) => i !== index);
    setList({ ...list, danaEntries: newDanaEntries });
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

      {list.danaEntries.map((entry, index) => (
        <View key={index} style={styles.entryContainer}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Dana Type</Text>
              <TextInput
                style={styles.input}
                value={entry.danaType}
                onChangeText={(text) =>
                  handleDanaEntriesChange(index, "danaType", text)
                }
                placeholder="Enter dana type"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Rate</Text>
              <TextInput
                style={styles.input}
                value={String(entry.rate)}
                onChangeText={(text) =>
                  handleDanaEntriesChange(index, "rate", parseFloat(text) || 0)
                }
                keyboardType="numeric"
                placeholder="Enter rate"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Total Bags</Text>
              <TextInput
                style={styles.input}
                value={String(entry.totalBags)}
                onChangeText={(text) =>
                  handleDanaEntriesChange(
                    index,
                    "totalBags",
                    parseFloat(text) || 0
                  )
                }
                keyboardType="numeric"
                placeholder="Enter total bags"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>1 Bag Weight (Kg)</Text>
              <TextInput
                style={styles.input}
                value={String(entry.bagWeight)}
                onChangeText={(text) =>
                  handleDanaEntriesChange(
                    index,
                    "bagWeight",
                    parseFloat(text) || 0
                  )
                }
                keyboardType="numeric"
                placeholder="Enter bag weight"
              />
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Weight:</Text>
            <Text>{entry.totalBags * entry.bagWeight} KG</Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeDanaEntry(index)}
          >
            <Text style={styles.removeButtonText}>Remove Dana Entry</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addDanaEntry}>
        <Text style={styles.addButtonText}>Add Dana Entry</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.label}>Back Due:</Text>
        <TextInput
          style={styles.input}
          value={String(list.backDue)}
          keyboardType="numeric"
          onChangeText={(text) =>
            setList({ ...list, backDue: parseFloat(text) || 0 })
          }
          placeholder="₹ Enter back due"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Paid Payment:</Text>
        <TextInput
          style={styles.input}
          value={String(list.paidPayment)}
          keyboardType="numeric"
          onChangeText={(text) =>
            setList({ ...list, paidPayment: parseFloat(text) || 0 })
          }
          placeholder="₹ Enter paid payment"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Payment:</Text>
        <Text>₹ {list.totalPayment}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Due Payment:</Text>
        <Text>₹ {list.duePayment}</Text>
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
    fontWeight: "bold",
    marginVertical: 4,
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
    marginTop: 20,
    marginBottom: 40,
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
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems:'center',
    gap:5,
  },
  col: {
    flex: 1,
    display:'flex',
    flexDirection:'column',
    marginHorizontal: 5,
  },
  entryContainer: {
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
    fontWeight: "bold",
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
