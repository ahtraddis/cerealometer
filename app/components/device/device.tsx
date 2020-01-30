import * as React from "react"
import { useState, useEffect } from "react"
import { useStores } from "../../models/root-store"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "../"
import database from '@react-native-firebase/database'
import { MESSAGE } from "../../styles/common"
const DEVICE: ViewStyle = {
  marginBottom: 10,
}
const DEVICE_NAME: ViewStyle = {
  alignItems: "center",
  backgroundColor: "darkgreen",
  padding: 10,
}
const DEVICE_TEXT: TextStyle = {
  color: "#fff",
}

export interface DeviceProps {
  id: string
  name: string
  led_state: number
  port_count: number
  user_id: string
}

export const Device: React.FunctionComponent<DeviceProps> = props => {
  const { id } = props
  const { deviceStore } = useStores()
  const [device, setDevice] = useState(null);

  function onDeviceChange(snapshot) {
    __DEV__ && console.tron.log("onDeviceChange()", snapshot.val())
    setDevice(snapshot.val());
    deviceStore.updateDevice(id, snapshot.val())
  }

  useEffect(() => {
    const initial = deviceStore.devices.findIndex(device => device.id == id)
    setDevice(deviceStore.devices[initial])

    const ref = database().ref(`/devices/${id}`);
    ref.on('value', onDeviceChange)

    // Unsubscribe from changes on unmount
    return () => ref.off('value', onDeviceChange)
  }, []);

  if (device == null) return <View style={MESSAGE}><Text>No device state yet</Text></View>

  return (
    <View style={DEVICE}>
      <View style={DEVICE_NAME}>
        <Text style={DEVICE_TEXT}>
          {device.name}
        </Text>
        <Text>
          port_count: {device.port_count}
        </Text>
        <Text>
          led_state: {device.led_state}
        </Text>
      </View>
    </View>
  )
}
