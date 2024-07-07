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
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { appColors } from "../../constants/appColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function Icon({ name, color }) {
  return <FontAwesome name={name} size={20} style={{ marginLeft: 3, color }} />;
}

const DanaEntryData = () => {
  const [list, setList] = useState();
  const [displayList, setDisplayList] = useState();
  const [clicked, setClicked] = useState(false);
  const [edit_Delete_Data, setEdit_Delete_Data] = useState(null);
  const [displayOptions, setDisplayOptions] = useState(false);

  const route = useLocalSearchParams();
  const navigation = useNavigation();
  const { dealerkey, dealerName, dealerContact } = route;

  function handleSearch(inputText) {
    if (inputText === "") {
      setDisplayList(list);
    } else {
      const updatedList = list.map((item) => {
        const dana = item.danaEntry.filter((data) => {
          return (
            data.danaType.toLowerCase().includes(inputText.toLowerCase()) ||
            data.date.toLowerCase().includes(inputText.toLowerCase()) ||
            data.totalWeight.toString().includes(inputText.toString()) // Convert totalWeight to string for comparison
          );
        });

        return { ...item, danaEntry: dana };
      });

      setDisplayList(updatedList);
    }
  }

  async function handleDeleteEntry(keyToDelete) {
    const newList = list.map((item) => {
      const newDanaEntry = item.danaEntry.filter(
        (entry) => entry.key !== keyToDelete
      );
      return { ...item, danaEntry: newDanaEntry };
    });

    setList(newList);
    setDisplayList(newList);
    setDisplayOptions(false);
    await AsyncStorage.setItem("dana_entry", JSON.stringify(newList));
    callMe();
  }

  async function callMe() {
    const list = await AsyncStorage.getItem("dana_entry");
    // console.log("fetched list: ", list);
    setList(JSON.parse(list));
    setDisplayList(JSON.parse(list));
  }

  {
    /**It calls the Async storage to fetch data after returning from add dana page */
  }
  useEffect(() => {
    callMe();

    const unsubscribe = navigation.addListener("focus", callMe);
    return unsubscribe;
  }, [navigation]);

  {
    /**It sets the title of the header on the top */
  }
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

      <ScrollView style={styles.container}>
        <View style={styles.cardContainer}>
          {list &&
            displayList &&
            displayList.map((dataOfOneDealer) => {
              if (dataOfOneDealer.key == dealerkey) {
                return dataOfOneDealer.danaEntry.map(
                  ({
                    date,
                    key,
                    danaType,
                    rate,
                    bagWeight,
                    totalBags,
                    totalWeight,
                    backDue,
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
                            pathname: "/danaEntryDataPage",
                            params: {
                              key,
                              date,
                              danaType,
                              rate,
                              bagWeight,
                              totalBags,
                              totalWeight,
                              duePayment,
                              backDue,
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
                          date,
                          danaType,
                          bagWeight,
                          totalBags,
                          totalWeight,
                          backDue,
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
                        {danaType}: {date} - {totalWeight}KG
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
                              <View style={styles.row}>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (!clicked) {
                                      setClicked(true);

                                      router.push({
                                        pathname: "/editDanaEntry",
                                        params: edit_Delete_Data
                                      })
                                    }
                                    setDisplayOptions(false)
                                  }}
                                  style={styles.editButton}
                                >
                                  <Text style={styles.buttonText}>
                                    Edit <Icon name="edit" color={appColors.white} />
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => {
                                    handleDeleteEntry(edit_Delete_Data.entryKey);
                                    setDisplayOptions(false)
                                  }}
                                  style={styles.deleteButton}
                                >
                                  <Text style={styles.buttonText}>
                                    Delete <Icon name="trash" color={appColors.white} />
                                  </Text>
                                </TouchableOpacity>
                              </View>

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
      </ScrollView >

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          router.push({
            pathname: "/danaentry",
            params: { dealerName },
          });
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View >
  );
};

export default DanaEntryData;

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
    backgroundColor: "#030E4F",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
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
    color: appColors.white,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 15,
    backgroundColor: appColors.blue,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
    color: appColors.white,
  },
  editButton: {
    width: '48%',
    fontSize: 17,
    padding: 15,
    borderRadius: 10,
    backgroundColor: appColors.blue,
  },
  deleteButton: {
    width: '48%',
    fontSize: 17,
    padding: 15,
    borderRadius: 10,
    backgroundColor: appColors.red
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: "bold",
    paddingVertical: 15,
    paddingHorizontal: 8,
    color: appColors.blue,
  },
  cancelButton: {
    borderRadius: 10,
    backgroundColor: '#adc5ff',
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
});
