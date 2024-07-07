import { Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { appColors } from "@/constants/appColors";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// AsyncStorage.clear()

async function getTheList() {
  const list = await AsyncStorage.getItem("sold_maal_entry");
  return list !== null ? JSON.parse(list) : [];
}

function Icon({ name, color }) {
  return <FontAwesome name={name} size={20} style={{ marginLeft: 3, color }} />;
}

export default function TabTwoScreen() {
  const [dealerList, setDealerList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [delete_edit_data, setDelete_edit_data] = useState(null);
  const [displayOptions, setDisplayOptions] = useState(false);
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('newSellingDealer'); // Replace 'YourPage' with the name of your page component
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

  async function handleDeleteDealer({ dealerkey }) {
    const result = dealerList.filter((item) => {
      return item.key !== dealerkey;
    });

    setDealerList(result);
    setDisplayList(result);
    setDisplayOptions(false);
    await AsyncStorage.setItem("sold_maal_entry", JSON.stringify(result));
    callMe();
  }

  async function handleEditDealerData(params) {
    router.push({
      pathname: "/editSellingDealerData",
      params: params,
    });
  }

  async function callMe() {
    const list = await getTheList();

    setDealerList(list);
    setDisplayList(list);
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

  useEffect(() => {
    callMe();

    const unsubscribe = navigation.addListener("focus", callMe);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ backgroundColor: appColors.white, height: '100%' }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        onChangeText={(text) => handleSearch(text)}
      />

      <ScrollView style={styles.container}>
        <View style={styles.cardContainer}>
          {dealerList &&
            displayList.map((data, index) => (
              <Pressable
                key={index}
                style={styles.card}
                onPress={() => {
                  if (!clicked) {
                    setClicked(true);
                    router.push({
                      pathname: "/soldentryData/[index]",
                      params: {
                        dealerkey: data.key,
                        dealerName: data.dealerName,
                        dealerContact: data.dealerContact
                      },
                    });
                  }
                }}
                onLongPress={() => {
                  const params = {
                    dealerkey: data.key,
                    name: data.dealerName,
                    number: data.dealerContact,
                  };
                  setDisplayOptions(true);
                  setDelete_edit_data(params);
                  // console.log(delete_edit_data);
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
                              Edit <Icon name="edit" color={appColors.black} />
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
                              Delete <Icon name="trash" color={appColors.black} />
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
    backgroundColor: appColors.white
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
    color: appColors.yellow,
    fontSize: 30,
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
    backgroundColor: appColors.white
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
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
    color: appColors.black,
  },
  editButton: {
    width: '48%',
    fontSize: 17,
    padding: 15,
    borderRadius: 10,
    backgroundColor: appColors.yellow,
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
    color: appColors.black,
  },
  cancelButton: {
    borderRadius: 10,
    backgroundColor: appColors.lightYellow,
  },
});
