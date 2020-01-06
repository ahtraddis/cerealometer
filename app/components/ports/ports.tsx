import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"
import { Port } from "../port/port"

import { useState, useEffect } from 'react'

import database from '@react-native-firebase/database'

const PORTS: ViewStyle = {
  marginBottom: 10,
}

export interface PortsProps {
  device_id: string,
}

export const Ports: React.FunctionComponent<PortsProps> = props => {
  //console.log("ports.tsx: props: ", props)

  const [initializing, setInitializing] = useState(true);
  const [ports, setPorts] = useState(null);

  function onPortsChange(snapshot) {
    console.log(`onPortsChange fired for device '${props.device_id}':`, snapshot);
    setPorts(snapshot.val());
 
    // Connection established
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const ref = database().ref(`ports/${props.device_id}`);
    ref.on('value', onPortsChange);

    // Unsubscribe from changes on unmount
    return () => ref.off('value', onPortsChange);
  }, [props.deviceId]);
 
  // Wait for first connection
  if (initializing) return null;

  return (
    <View style={PORTS}>
      { !ports && (
        <Text>No cereal here :-(</Text>
      )}
      { ports && Object.keys(ports).map((key, index) => {
        var obj = ports[key]
        return (
          <Port
            key={index}
            device_id={props.device_id}
            slot={key}
            weight_kg={obj.weight_kg}
            status={obj.status}
          />
        )
      })}
    </View>
  )
}
