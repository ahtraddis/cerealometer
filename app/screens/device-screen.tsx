import * as React from "react"
import { useStores } from "../models/root-store"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, FlatList, TextStyle, SafeAreaView } from "react-native"
import { Screen, Button, Wallpaper } from "../components"
import { color, spacing } from "../theme"
import { NavigationScreenProps } from "react-navigation"
import { Device } from "../components"

const HARDCODED_TEST_USER_ID = "1"

const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const BUTTON: ViewStyle = {
  backgroundColor: "#5D2555",
  padding: 15,
}
const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const DEVICE_LIST: ViewStyle = {
  marginBottom: spacing.large,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  padding: 10,
}

// For local testing. App won't normally fetch data directly from the ESP8266.
// const fetchData = () => {
//   fetch(BASE_URL + '/status', {
//     method: 'GET',
//   })
//   .then(response => response.json())
//   .then(json => {
//     //console.log("json: " + JSON.stringify(json));
//     setState({
//       ...state,
//       ledState: json.led_state,
//       weightKg: json.weight_kg,
//       deflectionPct: getPercentage(json.weight_kg),
//       devices: [json],
//     })
//   })
//   .catch(error => {
//     console.error(error);
//   });
// }

// For local testing.
// const updateLedState = (value) => {
//   //alert("updateLedState(): value=" + (value ? "on" : "off"));
//   // update state optimistically
//   setState({
//     ...state,
//     ledState: value,
//   });
//   fetch(BASE_URL + '/led/' + (value ? "on" : "off"), {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     }
//   })
//   .then(response => response.json())
//   .then(json => {
//     setState({
//       ...state,
//       ledState: json.led_state,
//       weightKg: json.weight_kg,
//       deflectionPct: getPercentage(json.weight_kg),
//     })
//   })
//   .catch(error => {
//     console.error(error);
//   });
// }

export interface DeviceScreenProps extends NavigationScreenProps<{}> {}

export const DeviceScreen: React.FunctionComponent<DeviceScreenProps> = observer((props) => {
  const { deviceStore, itemDefinitionStore, userStore } = useStores()

  useEffect(() => {
    deviceStore.getDevices();
    itemDefinitionStore.getItemDefinitions();
    // [eschwartz-TODO] Hardcoded user ID
    userStore.getUser(HARDCODED_TEST_USER_ID);
    //console.log("deviceStore: ", JSON.stringify(deviceStore));
    //console.log("itemDefinitionStore: ", JSON.stringify(itemDefinitionStore));
    console.log("userStore: ", JSON.stringify(userStore));
  });

  const goToScanScreen = React.useMemo(() => () => props.navigation.navigate("scan"), [
   props.navigation,
  ])

  const renderDevice = ({ item }) => {
    return (
      <Device {...item} />
    )
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER}>
        <FlatList
          style={DEVICE_LIST}
          data={deviceStore.devices}
          renderItem={renderDevice}
          //extraData={{ extraDataForMobX: devices.length > 0 ? devices[0].device : "" }}
          keyExtractor={item => item.id}
        />
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            style={BUTTON}
            textStyle={BUTTON_TEXT}
            tx="deviceScreen.goToScanScreen"
            onPress={goToScanScreen}
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
