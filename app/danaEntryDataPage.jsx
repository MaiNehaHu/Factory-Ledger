import {
  Linking,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Share as RNShare,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { appColors } from "../constants/appColors";
import { useLocalSearchParams, useNavigation } from "expo-router";
//share
import ViewShot from "react-native-view-shot";
import { shareAsync } from "expo-sharing";

const danaEntryDataPage = () => {
  const route = useLocalSearchParams();
  const navigation = useNavigation();
  const viewShotRef = useRef();

  const {
    key,
    date,
    rate,
    danaType,
    totalBags,
    duePayment,
    bagWeight,
    totalWeight,
    backDue,
    paidPayment,
    totalPayment,
    dealerName,
    dealerContact,
  } = route;

  function handleCall() {
    Linking.openURL(`tel:+91 ${dealerContact}`);
  }

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      await shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share this image",
        UTI: "public.jpeg",
      });
    } catch (error) {
      console.error("Error sharing screenshot:", error);
    }
  };

  React.useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `${dealerName} Dana Entry` });
    }
  }, [dealerName, navigation]);

  return (
    <View style={styles.container}>
      {/**Too print */}
      <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bill to: {dealerName}</Text>
          <Text style={styles.headerText}>From: Rajeev Kumar</Text>
        </View>

        <View style={[styles.date_ref, { backgroundColor: appColors.white, }]}>
          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.alignLeft}>Contact: {dealerContact}</Text>
          </TouchableOpacity>
          <Text style={[styles.alignRight, { fontWeight: '600' }]}>Date: {date}</Text>
          <Text style={styles.alignRight}>Ref No: {key}</Text>
        </View>

        <View style={styles.tableContainer}>
          {/* Table row_header */}
          <View style={styles.row_header}>
            <Text style={styles.header_cell}>Dana</Text>
            <Text style={styles.header_cell}>Qty</Text>
            <Text style={styles.header_cell}>Bag wt.</Text>
            <Text style={styles.header_cell}>Total wt.</Text>
          </View>
          {/* Table body */}
          <View style={styles.row}>
            <Text style={styles.cell}>{danaType}</Text>
            <Text style={styles.cell}>{totalBags}Katta</Text>
            <Text style={styles.cell}>{bagWeight}Kg</Text>
            <Text style={styles.cell}>{totalWeight}Kg</Text>
          </View>
          {/* Table row_header */}
          <View style={styles.row_header}>
            <Text style={styles.header_cell}>Rate/Kg</Text>
            <Text style={styles.header_cell}>Total</Text>
            <Text style={styles.header_cell}>Paid</Text>
            <Text style={styles.header_cell}>Back Due</Text>
          </View>
          {/* Table Body */}
          <View style={styles.row}>
            <Text style={styles.cell}>₹{rate}</Text>
            <Text style={styles.cell}>₹{totalPayment}</Text>
            <Text style={styles.cell}>₹{paidPayment}</Text>
            <Text style={styles.cell}>₹{backDue}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.text}>Updated Due Balance: ₹{duePayment}</Text>
        </View>
      </ViewShot>

      <TouchableOpacity style={styles.submit} onPress={handleShare}>
        <Text style={styles.submitText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default danaEntryDataPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: appColors.white,
  },
  tableContainer: {
    padding: 10,
    backgroundColor: appColors.white,
  },
  row_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: appColors.lightBlue,
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
    paddingVertical: 10,
    fontSize: 17,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  bold: {
    fontWeight: "bold",
  },
  text: {
    fontSize: 17,
    padding: 10,
    fontWeight: '600',
    paddingBottom: 20,
    backgroundColor: appColors.white,
  },
  header: {
    display: "flex",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: appColors.blue,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
    color: appColors.white,
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
    backgroundColor: appColors.blue,
  },
  submitText: {
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    color: appColors.white,
  },
});
