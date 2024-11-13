import React from "react";
import { useLocalSearchParams } from "expo-router";

const InventoryListScreen = () => {

  const { id, store, date } = useLocalSearchParams();

  console.log("Data",id, store, date);


  return <></>;
};

export default InventoryListScreen;
