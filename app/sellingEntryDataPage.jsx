import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Share as RNShare,
  Image,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appColors } from "../constants/appColors";
//share
import ViewShot from "react-native-view-shot";
import { shareAsync } from "expo-sharing";

const SellingEntryDataPage = () => {
  const route = useLocalSearchParams();
  const navigation = useNavigation();
  const { key, dealerkey, dealerName, dealerContact } = route;
  const viewShotRef = useRef();

  const [data, setData] = useState({
    date: "",
    bagsData: [{ color: "", rate: 0, totalBags: 0, bagWeight: 0 }],
    paidPayment: 0,
    duePayment: 0,
    totalPayment: 0,
    backDue: 0,
  });

  const handleCall = () => {
    Linking.openURL(`tel:+91${dealerContact}`);
  };

  const callMe = async () => {
    const result = await AsyncStorage.getItem("sold_maal_entry");
    const parsedResult = JSON.parse(result);

    // Find the entry with the matching key
    const dealerData = parsedResult.find((dealer) => dealer.key === dealerkey);
    if (dealerData) {
      const entryData = dealerData.soldEntry.find((entry) => entry.key === key);
      if (entryData) {
        setData(entryData);
        // console.log(data);
      }
    }
  };

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

  useEffect(() => {
    callMe();
  }, []);

  useEffect(() => {
    if (dealerName) {
      navigation.setOptions({ title: `${dealerName} Sold Entry` });
    }
  }, [dealerName, navigation]);

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bill to: {dealerName}</Text>
          <Text style={styles.headerText}>From: Rajeev Kumar</Text>
        </View>

        <View style={[styles.date_ref, { backgroundColor: appColors.white }]}>
          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.alignLeft}>Contact: {dealerContact}</Text>
          </TouchableOpacity>

          <Text style={[styles.alignRight, { fontWeight: "600" }]}>
            Date: {data.date}
          </Text>
          <Text style={styles.alignRight}>Ref No: {key}</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.rowHeader}>
            <Text style={styles.headerCell}>Color</Text>
            <Text style={styles.headerCell}>Rate/Kg</Text>
            <Text style={styles.headerCell}>Qty</Text>
            <Text style={styles.headerCell}>Bag wt.</Text>
            <Text style={styles.headerCell}>Total</Text>
          </View>

          {data.bagsData.map((bag, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{bag.color}</Text>
              <Text style={styles.cell}>₹{bag.rate}</Text>
              <Text style={styles.cell}>{bag.totalBags} bag</Text>
              <Text style={styles.cell}>{bag.bagWeight} Kg</Text>
              <Text style={styles.cell}>
                ₹{bag.rate * bag.bagWeight * bag.totalBags}
              </Text>
            </View>
          ))}

          <View style={styles.rowHeader}>
            <Text style={styles.headerCell}>To Pay</Text>
            <Text style={styles.headerCell}>Back Due</Text>
            <Text style={styles.headerCell}>Paid</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>₹{data.totalPayment}</Text>
            <Text style={styles.cell}>₹{data.backDue}</Text>
            <Text style={styles.cell}>₹{data.paidPayment}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.text}>
            Updated Due Balance: ₹{data.duePayment}
          </Text>
        </View>
      </ViewShot>

      <TouchableOpacity style={styles.submit} onPress={handleShare}>
        <Text style={styles.submitText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SellingEntryDataPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: appColors.white,
    justifyContent: "space-between",
  },
  tableContainer: {
    backgroundColor: appColors.white,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: appColors.lightYellow,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerCell: {
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
    fontWeight: "600",
    paddingBottom: 20,
    backgroundColor: appColors.white,
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
