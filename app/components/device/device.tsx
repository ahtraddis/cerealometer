import * as React from "react"
import { useState, useEffect } from "react"
import { useStores } from "../../models/root-store"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "../"
import database from '@react-native-firebase/database'

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
  device_id: string,
  name: string,
  led_state: number,
  port_count: number,
  user_id: string
}

export const Device: React.FunctionComponent<DeviceProps> = props => {
  const { device_id } = props
  const { deviceStore } = useStores()
  const [initializing, setInitializing] = useState(true);
  const [device, setDevice] = useState(null);

  function onDeviceChange(snapshot) {
    console.log("device: onDeviceChange(): snapshot.val(): ", JSON.stringify(snapshot.val(), null, 2))
    //console.log("device: onDeviceChange(): deviceStore: ", JSON.stringify(deviceStore))
    setDevice(snapshot.val());
    deviceStore.updateDevice(snapshot.val())

    // Connection established
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    //console.log("device: deviceStore: ", JSON.stringify(deviceStore, null, 2))
    const ref = database().ref(`/devices/${device_id}`);
    ref.on('value', onDeviceChange)

    // Unsubscribe from changes on unmount
    return () => ref.off('value', onDeviceChange)
  }, []);

  // Wait for first connection
  if (initializing) return null;

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
