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
  demo_state: number
  user_id: string
}

export const Device: React.FunctionComponent<DeviceProps> = props => {
  const { id, name, demo_state, user_id } = props
  const { deviceStore } = useStores()
  const [device, setDevice] = useState(null);

  function onDeviceChange(snapshot) {
    __DEV__ && console.tron.log("onDeviceChange()", snapshot.val(), id)
    setDevice({
      ...snapshot.val(),
      id: id
    });
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
      { device &&
        <View style={styles.name}>
          { ("name" in device) && device.name &&
            <Text style={styles.text}>
              name={device.name}
            </Text>
          }
          <Text style={styles.text}>
            demo_state={device.demo_state}
          </Text>
          <Text style={styles.text}>
            device_id={device.id}
          </Text>
          <Text style={styles.text}>
            user_id={device.user_id}
          </Text>
        </View>
      }
    </View>
  )
}
