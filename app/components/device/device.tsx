import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"
import { Ports } from "../ports/ports"

import { useState, useEffect } from 'react'

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

export interface DeviceProps {
  id: identifier,
  device_id: string,
  name: string,
  led_state: integer,
  user: string,
}

export const Device: React.FunctionComponent<DeviceProps> = props => {
  //console.log("device.tsx: props: ", props)

  const [initializing, setInitializing] = useState(true);
  const [device, setDevice] = useState(null);

  function onDeviceChange(snapshot) {
    console.log("onDeviceChange fired: ", snapshot.val());
    setDevice(snapshot.val());
 
    // Connection established
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const ref = database().ref(`devices/${props.device_id}`);
    ref.on('value', onDeviceChange);

    // Unsubscribe from changes on unmount
    return () => ref.off('value', onDeviceChange);
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
      <Ports device_id={props.device_id} />
    </View>
  )
}
