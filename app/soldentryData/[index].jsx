import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { appColors } from "../../constants/appColors";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function Icon({ name, color }) {
  return <FontAwesome name={name} size={20} style={{ marginLeft: 3, color }} />;
}

// AsyncStorage.clear()

const SoldEntry = () => {
  const [list, setList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [edit_Delete_Data, setEdit_Delete_Data] = useState(null);
  const [displayOptions, setDisplayOptions] = useState(false);

  const route = useLocalSearchParams();
  const navigation = useNavigation();
  const { dealerName, dealerkey, dealerContact } = route;

  function handleSearch(inputText) {
    if (inputText === "") {
      setDisplayList(list);
    } else {
      const updatedList = list.map((item) => {
        const sold = item.soldEntry.filter((data) => {
          return (
            data.date.toLowerCase().includes(inputText.toLowerCase()) ||
            data.totalWeight.toString().includes(inputText.toString()) // Convert totalWeight to string for comparison
          );
        });

        return { ...item, soldEntry: sold };
      });

      setDisplayList(updatedList);
    }
  }

  async function handleDeleteEntry(keyToDelete) {
    const newList = list.map((item) => {
      const newSoldEntry = item.soldEntry.filter(
        (entry) => entry.key !== keyToDelete
      );
      return { ...item, soldEntry: newSoldEntry };
    });

    setList(newList);
    setDisplayList(newList);
    setDisplayOptions(false);
    await AsyncStorage.setItem("sold_maal_entry", JSON.stringify(newList));
    callMe();
  }

  {
    /**It calls the Async storage to fetch data after returning from add dana page */
  }
  async function callMe() {
    const result = await AsyncStorage.getItem("sold_maal_entry");

    setList(JSON.parse(result));
    setDisplayList(JSON.parse(result));
  }

  useEffect(() => {
    callMe();

    const unsubscribe = navigation.addListener("focus", callMe);
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: dealerName });
    }
  }, [dealerName, navigation]);

  {
    /**This prevents double page opening on doulbe click */
  }
  useEffect(() => {
    let timer;
    if (clicked) {
      timer = setTimeout(() => {
        setClicked(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [clicked]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        onChangeText={(text) => handleSearch(text)}
      />

      <ScrollView>
        <View>
          {list &&
            displayList &&
            displayList.map((allData) => {
              if (allData.key == dealerkey) {
                return allData.soldEntry.map(
                  ({
                    date,
                    key,
                    rate,
                    bagWeight,
                    totalBags,
                    totalWeight,
                    duePayment,
                    totalPayment,
                    paidPayment,
                  }) => (
                    <Pressable
                      key={key}
                      style={styles.card}
                      onPress={() => {
                        if (!clicked) {
                          setClicked(true);

                          router.push({
                            pathname: "/sellingEntryDataPage",
                            params: {
                              key,
                              date,
                              rate,
                              bagWeight,
                              totalBags,
                              totalWeight,
                              duePayment,
                              paidPayment,
                              totalPayment,
                              dealerName,
                              dealerContact,
                            },
                          });
                        }
                      }}
                      onLongPress={() => {
                        const params = {
                          rate,
                          bagWeight,
                          totalBags,
                          totalWeight,
                          duePayment,
                          paidPayment,
                          totalPayment,
                          dealerkey,
                          dealerName,
                          entryKey: key,
                        }
                        setDisplayOptions(true);
                        setEdit_Delete_Data(params);
                      }}
                    >
                      <Text style={styles.textStyle}>
                        {date} - {totalWeight} KG
                      </Text>

                      {/**Modal */}
                      <Modal
                        animationType="fade"
                        transparent={true}
                        visible={displayOptions}
                        onRequestClose={() => setDisplayOptions(false)}
                      >
                        <Pressable
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "stretch",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                          onPress={() => setDisplayOptions(false)}
                        >
                          <Pressable onPress={(e) => e.stopPropagation()}>
                            <View style={styles.popUp}>
                              <TouchableOpacity
                                onPress={() => {
                                  if (!clicked) {
                                    setClicked(true);

                                    router.push({
                                      pathname: "/editSellingEntry",
                                      params: edit_Delete_Data
                                    })
                                  }
                                }}
                              >
                                <Text style={styles.popUpText}>
                                  Edit <Icon name="edit" color={appColors.black} />
                                </Text>
                              </TouchableOpacity>

                              {/**Delete button */}
                              <TouchableOpacity
                                onPress={() => handleDeleteEntry(edit_Delete_Data.entryKey)}
                              >
                                <Text style={styles.popUpText}>
                                  Delete
                                  <Icon name="trash" color={appColors.black} />
                                </Text>
                              </TouchableOpacity>

                              {/**Cancel button */}
                              <TouchableOpacity
                                onPress={() => setDisplayOptions(false)}
                                style={styles.cancelButton}
                              >
                                <Text style={styles.cancelText}>Cancel</Text>
                              </TouchableOpacity>
                            </View>
                          </Pressable>
                        </Pressable>
                      </Modal>
                    </Pressable>
                  )
                );
              }
            })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          router.push({
            pathname: "/soldentry",
            params: { dealerkey, dealerName },
          });
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SoldEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.black,
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: appColors.yellow,
  },
  searchBar: {
    height: 45,
    margin: 15,
    width: "90%",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: "100%",
  },
  textStyle: {
    fontSize: 17,
    color: appColors.black,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 15,
    backgroundColor: appColors.yellow,
  },
  popUp: {
    gap: 20,
    display: "flex",
    borderRadius: 10,
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  popUpText: {
    fontSize: 17,
    fontWeight: "bold",
    paddingHorizontal: 5,
    color: appColors.black,
  },
  cancelText: {
    color: appColors.black,
    fontSize: 17,
    fontWeight: "bold",
  },
  cancelButton: {
    fontSize: 17,
    padding: 10,
    borderRadius: 10,
    fontWeight: "bold",
    backgroundColor: appColors.yellow,
  },
});
