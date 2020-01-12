import * as React from "react"
import { useStores } from "../../models/root-store"
import { useState, useEffect } from 'react'
import { observer } from "mobx-react-lite"
import { DeviceStore } from "../../models/device-store"
import { ItemDefinitionStore } from "../../models/item-definition-store"
import { UserStore } from "../../models/user-store"
import { ViewStyle, View, FlatList, TextStyle } from "react-native"
import { Text, Screen, Button, Wallpaper, Switch } from "../../components"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { Device, User } from "../../components"

import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.extraLarge,
  marginBottom: spacing.medium,
}
const DEVICE_LIST: ViewStyle = {
  marginBottom: spacing.large,
}
const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  padding: 15,
  marginBottom: 10,
  backgroundColor: "#5D2555",
}
const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = {
  backgroundColor: "#20162D"
}
const SWITCH_CONTAINER: ViewStyle = {
  padding: 20,
  alignItems: "center"
}
const SWITCH: ViewStyle = {
  textAlign: "center",
  paddingVertical: spacing[100],
  backgroundColor: "#000",
  padding: 80,
  border: "1px solid red",
  margin: 10,
  width: 100,
}
const DEVICE: ViewStyle = {
  marginBottom: 10,
}
const DEVICE_NAME: ViewStyle = {
  alignItems: "center",
  backgroundColor: "darkgreen",
  padding: 10,
}
const DEVICE_TEXT: ViewStyle = {
  color: "#fff",
}
const SLOT: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: "100%",
  backgroundColor: "green",
}
const SLOT_NUMBER: ViewStyle = {
  width: "10%",
  alignItems: "center",
  backgroundColor: "forestgreen",
  padding: 10,
}
const SLOT_NAME: ViewStyle = {
  width: "45%",
  padding: 10
}
const SLOT_STATUS: ViewStyle = {
  width: "45%",
  padding: 10,
  alignItems: "flex-end"
}

const getPercentage = (weightKg) => {
  return Math.min(Math.max(parseInt(100.0 * weightKg / state.fullDeflectionWeightKg), 0), 100);
}

// For local testing. App won't normally fetch data directly from the ESP8266.
const fetchData = () => {
  fetch(BASE_URL + '/status', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(json => {
      //console.log("json: " + JSON.stringify(json));
      setState({
        ...state,
        ledState: json.led_state,
        weightKg: json.weight_kg,
        deflectionPct: getPercentage(json.weight_kg),
        devices: [json],
      })
    })
    .catch(error => {
      console.error(error);
    });
}

// For local testing.
const updateLedState = (value) => {
  //alert("updateLedState(): value=" + (value ? "on" : "off"));
  // update state optimistically
  setState({
    ...state,
    ledState: value,
  });
  fetch(BASE_URL + '/led/' + (value ? "on" : "off"), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(json => {
      setState({
        ...state,
        ledState: json.led_state,
        weightKg: json.weight_kg,
        deflectionPct: getPercentage(json.weight_kg),
      })
    })
    .catch(error => {
      console.error(error);
    });
}

export interface DeviceScreenProps extends NavigationScreenProps<{}> {
  deviceStore: DeviceStore,
  itemDefinitionStore: ItemDefinitionStore,
  userStore: UserStore,
}

export const DeviceScreen: React.FunctionComponent<DeviceScreenProps> = observer((props) => {
  const { deviceStore, itemDefinitionStore, userStore } = useStores()

  useEffect(() => {
    deviceStore.getDevices();
    itemDefinitionStore.getItemDefinitions();
    userStore.getUser();
    //console.log("deviceStore: ", JSON.stringify(deviceStore));
    //console.log("itemDefinitionStore: ", JSON.stringify(itemDefinitionStore));
    //console.log("userStore: ", JSON.stringify(userStore));
  });

  renderDevice = ({ item }) => {
    return (
      <Device {...item} />
    )
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} backgroundColor={color.transparent}>
        <FlatList
          style={DEVICE_LIST}
          data={deviceStore.devices}
          renderItem={renderDevice}
          //extraData={{ extraDataForMobX: devices.length > 0 ? devices[0].device : "" }}
          keyExtractor={item => item.id}
        />
      </Screen>
    </View>
  )
})
