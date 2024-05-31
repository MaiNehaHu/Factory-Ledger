import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { appColors } from "../constants/appColors";
import React from "react";

const sellingEntryDataPage = () => {
  const route = useLocalSearchParams();
  const navigation = useNavigation();

  const {
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
  } = route;

  function handleCall() {
    Linking.openURL(`tel:+91 ${dealerContact}`);
  }

  React.useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `${dealerName} Dana Entry` });
    }
  }, [dealerName, navigation]);

  return (
    <View style={styles.container}>
      {/**Too print */}
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bill to: {dealerName}</Text>
          <Text style={styles.headerText}>From: Rajeev Kumar</Text>
        </View>

        <View style={styles.date_ref}>
          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.alignLeft}>Contact: {dealerContact}</Text>
          </TouchableOpacity>
          <Text style={styles.alignRight}>Date: {date}</Text>
          <Text style={styles.alignRight}>Ref No: {key}</Text>
        </View>

        <View style={styles.tableContainer}>
          {/* Table row_header */}
          <View style={styles.row_header}>
            <Text style={styles.header_cell}>Qty</Text>
            <Text style={styles.header_cell}>Bag wt.</Text>
            <Text style={styles.header_cell}>Total wt.</Text>
          </View>
          {/* Table body */}
          <View style={styles.row}>
            <Text style={styles.cell}>{totalBags} Katta</Text>
            <Text style={styles.cell}>{bagWeight}Kg</Text>
            <Text style={styles.cell}>{totalWeight}Kg</Text>
          </View>
          {/* Table row_header */}
          <View style={styles.row_header}>
            <Text style={styles.header_cell}>Rate/Kg</Text>
            <Text style={styles.header_cell}>Paid</Text>
            <Text style={styles.header_cell}>Balance</Text>
          </View>
          {/* Table Body */}
          <View style={styles.row}>
            <Text style={styles.cell}>₹{rate}</Text>
            <Text style={styles.cell}>₹{paidPayment}</Text>
            <Text style={styles.cell}>₹{duePayment}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.text}> Total Payment: ₹{totalPayment}</Text>
        </View>
      </View>
    </View>
  );
};

export default sellingEntryDataPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    margin: 10,
  },
  row_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: appColors.lightYellow,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: appColors.white,
  },
  header_cell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  bold: {
    fontWeight: "bold",
  },
  text: {
    fontSize: 17,
    padding: 10,
  },
  header: {
    display: "flex",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: appColors.yellow,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
    color: appColors.black,
  },
  alignRight: {
    alignSelf: "flex-end",
    fontSize: 15,
  },
  alignLeft: {
    alignSelf: "flex-start",
    fontSize: 15,
  },
  date_ref: {
    padding: 10,
  },
  submit: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: appColors.yellow,
  },
  submitText: {
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    color: appColors.black,
  },
});
