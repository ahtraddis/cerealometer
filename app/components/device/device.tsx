import * as React from "react"
import { useState, useEffect } from "react"
import { useStores } from "../../models/root-store"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "../"
import { Items, Meter } from "../../components"

import database from '@react-native-firebase/database'

const HARDCODED_TEST_USER_ID = "1"

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
  //id: identifier,
  device_id: string,
  name: string,
  led_state: number,
  port_count: number,
  user_id: string
}

export const Device: React.FunctionComponent<DeviceProps> = props => {
  //console.log("device.tsx: props: ", props,
  const { userStore } = useStores()
  const [initializing, setInitializing] = useState(true);
  const [device, setDevice] = useState(null);
  //const [user, setUser] = useState(null);

  function onDeviceChange(snapshot) {
    console.log("onDeviceChange fired: ", snapshot.val());
    setDevice(snapshot.val());

    // Connection established
    if (initializing) setInitializing(false);
  }

  function onUserChange(snapshot) {
    console.log("onUserChange fired: ", snapshot.val());
    let snap = snapshot.val()
    //setUser(snap)
    userStore.user.setUser(snap)
   }

  useEffect(() => {
    const ref = database().ref(`/devices/${props.device_id}`);
    ref.on('value', onDeviceChange);

    // [eschwartz-TODO] Hardcoded user ID
    const ref2 = database().ref(`/users/${HARDCODED_TEST_USER_ID}`);
    ref2.on('value', onUserChange);

    // Unsubscribe from changes on unmount
    return () => {
      ref2.off('value', onUserChange);
      ref.off('value', onDeviceChange);
    }
  }, [props.device_id]);

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
