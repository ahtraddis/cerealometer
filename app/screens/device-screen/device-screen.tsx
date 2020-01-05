import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, FlatList, TextStyle } from "react-native"
import { Text, Screen, Slot, Device } from "../../components"
import { useStores } from "../../models/root-store"
import { useState, useEffect } from 'react'
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { DeviceStore } from "../../models/device-store"

export interface DeviceScreenProps extends NavigationScreenProps<{}> {
  deviceStore: DeviceStore
}

export interface DeviceScreenState {
  refreshing: boolean
}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.extraLarge,
  marginBottom: spacing.medium,
}

const DEVICE_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

export const DeviceScreen: React.FunctionComponent<DeviceScreenProps> = observer((props) => {
  const { deviceStore } = useStores()
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    deviceStore.getDevices();
    console.log("deviceStore: ", JSON.stringify(deviceStore));
  });

  renderDevice = ({ item }) => {
    const device: Device = item
    return (
      <Device id={item.id} name={item.name} led_state={item.led_state} slots={[{"weight_kg": .1, "status": "one"}, {"weight_kg": .2, "status": "two"}]} />
      /*<Device name={item.name} led_state={item.led_state} slots={item.slots} />*/
    )
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <View style={HEADER_CONTAINER}>
        <Text preset="header" tx="deviceScreen.header" />
        <Text>refreshing: {refreshing ? "true" : "false"}</Text>
      </View>
      <FlatList
        style={DEVICE_LIST}
        data={deviceStore.devices}
        renderItem={renderDevice}
        //extraData={{ extraDataForMobX: devices.length > 0 ? devices[0].device : "" }}
        keyExtractor={item => item.id}
        //onRefresh={alert("refresh!")}
        refreshing={refreshing}
      />
    </Screen>
  )
})

