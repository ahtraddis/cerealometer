import * as React from "react"
import { useStores } from "../models/root-store"
import { ViewStyle, TextStyle } from "react-native"
import { Screen, Text, Button } from "../components"
import { color } from "../theme"
import { NavigationScreenProps } from "react-navigation"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}
const BUTTON: ViewStyle = {
  backgroundColor: color.palette.darkOrange,
  padding: 10,
}
const BUTTON_TEXT: TextStyle = {
  color: '#fff',
  fontSize: 20,
}

export interface AlarmScreenProps extends NavigationScreenProps<{}> {
}

export const AlarmScreen: React.FunctionComponent<AlarmScreenProps> = (props) => {
  const { userStore, deviceStore, portStore, itemStore, itemDefinitionStore } = useStores()

  const clearStores = () => {
    console.log("clearing all stores")
    userStore.clearUser()
    deviceStore.clearDevices()
    portStore.clearPorts()
    itemStore.clearItems()
    itemDefinitionStore.clearItemDefinitions()
    console.log("userStore.user:", JSON.stringify(userStore.user, null, 2))
    console.log("deviceStore.devices:", JSON.stringify(deviceStore.devices, null, 2))
    console.log("portStore.ports:", JSON.stringify(portStore.ports, null, 2))
    console.log("itemStore.items:", JSON.stringify(itemStore.items, null, 2))
    console.log("itemDefinitionStore.itemDefinitions:", JSON.stringify(itemDefinitionStore.itemDefinitions, null, 2))
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" tx="alarmScreen.header" />
      <Button text={"Clear all stores"} style={BUTTON} textStyle={BUTTON_TEXT} onPress={clearStores} />
    </Screen>
  )
}
