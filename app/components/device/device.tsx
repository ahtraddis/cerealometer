import * as React from "react"
import { useState, useEffect } from "react"
import { useStores } from "../../models/root-store"
import { View } from "react-native"
import { Text } from "../"
import database from '@react-native-firebase/database'
import { styles } from "./device.styles"

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

  return (
    <View style={styles.device}>
      <View style={styles.name}>
        <Text style={styles.text}>
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
