import * as React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, ImageStyle, TextStyle, ScrollView, SafeAreaView } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"
import { Items, Meter } from "../../components"
import { useState, useEffect } from 'react'

import { useStores } from "../../models/root-store"
import { UserStore } from "../../models/user-store"

import database from '@react-native-firebase/database'

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

export interface DeviceProps extends NavigationScreenProps<{}> {
  id: identifier,
  device_id: string,
  name: string,
  led_state: integer,
  user: string,

  userStore: UserStore,
}

export const Device: React.FunctionComponent<DeviceProps> = props => {
  //console.log("device.tsx: props: ", props;

  const { userStore } = useStores()
  const [initializing, setInitializing] = useState(true);
  const [device, setDevice] = useState(null);
  const [user, setUser] = useState(null);

  function onDeviceChange(snapshot) {
    console.log("onDeviceChange fired: ", snapshot.val());
    setDevice(snapshot.val());
 
    // Connection established
    if (initializing) setInitializing(false);
  }

  function onUserChange(snapshot) {
    console.log("onUserChange fired: ", snapshot.val());
    let snap = snapshot.val()
    setUser(snap)
    userStore.user.setUser(snap)
   }

  useEffect(() => {
    const ref = database().ref(`/devices/${props.device_id}`);
    ref.on('value', onDeviceChange);

    // [eschwartz-TODO] Hardcoded email ID
    const ref2 = database().ref(`/users/eric%40whyanext,com`);
    ref2.on('value', onUserChange);

    // Unsubscribe from changes on unmount
    return () => {
      ref2.off('value', onUserChange);
      ref.off('value', onDeviceChange);
    }
  }, [props.deviceId]);
 
  // Wait for first connection
  if (initializing) return null;

  return (
    <View style={DEVICE}>
      <View style={DEVICE_NAME}>
        <Text style={DEVICE_TEXT}>
          {device.name}
        </Text>
      </View>
      <Meter />
      <Items device_id={props.device_id} />
    </View>
  )
}
