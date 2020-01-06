import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, FlatList, TextStyle, SafeAreaView } from "react-native"
import { Text, Screen, Button, Wallpaper, Switch } from "../../components"
import { useStores } from "../../models/root-store"
import { useState, useEffect } from 'react'
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { DeviceStore } from "../../models/device-store"
import { Device } from "../../components"
import RNSpeedometer from 'react-native-speedometer'

import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'


export interface DeviceScreenProps extends NavigationScreenProps<{}> {
  deviceStore: DeviceStore
}

export const DeviceScreen: React.FunctionComponent<DeviceScreenProps> = observer((props) => {
  const { deviceStore } = useStores()
  const [initializing, setInitializing] = useState(true);
  const [device, setDevice] = useState(null);

  const deviceId = "-LxNyE47HCaN9ojmR3D2";

  function onDeviceChange(snapshot) {
    console.log("onDeviceChange fired: ", snapshot.val());
    setDevice(snapshot.val());
 
    // Connection established
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    //deviceStore.getDevices();
    //console.log("deviceStore: ", JSON.stringify(deviceStore));

    const ref = database().ref(`devices/${deviceId}`);

    // Subscribe to value changes
    ref.on('value', onDeviceChange);
 
    // Unsubscribe from changes on unmount
    return () => ref.off('value', onDeviceChange);


  }, [deviceId]);

  // Wait for first connection
  if (initializing) return null;

  return (
    <View>
      <Text style={{color: "black", padding: 30}}>{device.name}</Text>
    </View>
  )
})

