import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import { appColors } from "@/constants/appColors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function Icon({ name, color }) {
  return <FontAwesome name={name} size={20} style={{ marginLeft: 3, color }} />;
}

// AsyncStorage.clear()

async function getTheList() {
  const list = await AsyncStorage.getItem("dana_entry");
  return list !== null ? JSON.parse(list) : [];
}

export default function TabOneScreen() {
  const [dealerList, setDealerList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [delete_edit_data, setDelete_edit_data] = useState(null);
  const [displayOptions, setDisplayOptions] = useState(false);
  const navigation = useNavigation();

  // console.log(dealerList, " Dealer list length: ", dealerList.length);

  const handlePress = () => {
    navigation.navigate("newDanaDealer");
  };

  function handleSearch(searchText) {
    if (searchText === "") {
      setDisplayList(dealerList);
    } else {
      const result = dealerList.filter((item) => {
        return item.dealerName.toLowerCase().includes(searchText.toLowerCase());
      });
      setDisplayList(result);
    }
  }

  async function handleDeleteDealer({ key }) {
    console.log(key);
    const result = dealerList.filter((item) => {
      return item.key !== key;
    });

    setDealerList(result);
    setDisplayList(result);
    setDisplayOptions(false);
    await AsyncStorage.setItem("dana_entry", JSON.stringify(result));
    callMe();
  }

  async function handleEditDealerData(params) {
    router.push({
      pathname: "/editDanaDealerData",
      params: params,
    });
  }

  async function callMe() {
    const list = await getTheList();

    setDealerList(list);
    setDisplayList(list);
  }

  {
    /**It fetches the data after returning from other page */
  }
  useEffect(() => {
    callMe();

    const unsubscribe = navigation.addListener("focus", callMe);
    return unsubscribe;
  }, [navigation]);

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
    <View style={{ backgroundColor: appColors.white, height: '100%' }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        onChangeText={(text) => handleSearch(text)}
      />

      <ScrollView style={styles.container}>
        <View style={styles.cardContainer}>
          {displayList &&
            displayList.map((data) => (
              <Pressable
                key={data.key}
                style={styles.card}
                onPress={() => {
                  if (!clicked) {
                    setClicked(true);

                    router.push({
                      pathname: "/danaentryData/[index]",
                      params: {
                        dealerkey: data.key,
                        dealerName: data.dealerName,
                        dealerContact: data.dealerContact,
                      },
                    });
                  }
                }}
                onLongPress={() => {
                  const params = {
                    key: data.key,
                    name: data.dealerName,
                    number: data.dealerContact,
                  };
                  setDisplayOptions(true);
                  setDelete_edit_data(params);
                }}
              >
                <Text style={styles.textStyle}>{data.dealerName}</Text>

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
                          {/**Edit button */}
                          <TouchableOpacity
                            onPress={() => {
                              handleEditDealerData(delete_edit_data);
                              setDisplayOptions(false)
                            }}
                            style={styles.editButton}
                          >
                            <Text style={styles.buttonText}>
                              Edit <Icon name="edit" color={appColors.white} />
                            </Text>
                          </TouchableOpacity>

                          {/**Delete button */}
                          <TouchableOpacity
                            onPress={() => {
                              handleDeleteDealer(delete_edit_data);
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
            ))}
        </View>
      </ScrollView>

      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: appColors.white,
  },
  addButton: {
    width: 50,
    right: 20,
    height: 50,
    bottom: 20,
    elevation: 3,
    borderRadius: 25,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.blue,
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: appColors.white,
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
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: appColors.blue,
  },
  cardContainer: {
    width: "100%",
    backgroundColor: appColors.white,
  },
  textStyle: {
    fontSize: 17,
    color: appColors.white,
    backgroundColor: appColors.blue,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 15,
    backgroundColor: appColors.blue,
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
    justifyContent:'space-between',
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
    backgroundColor: appColors.lightBlue,
  },
});
