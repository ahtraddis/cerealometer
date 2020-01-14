import * as React from "react"
import { useState, useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { Text } from "../"
import { Port } from "../port/port"
import SwiperFlatList from 'react-native-swiper-flatlist';

import database from '@react-native-firebase/database'

export const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  child: {
    height: height * 0.5,
    width,
    justifyContent: 'center'
  },
  text: {
    fontSize: width * 0.5,
    textAlign: 'center'
  }
});

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
    const ref = database().ref(`/ports/${props.device_id}`);
    ref.on('value', onPortsChange);

    // Unsubscribe from changes on unmount
    return () => ref.off('value', onPortsChange);
  }, [props.device_id]);

  const renderPort = ({ item }) => {
    return (
      <View style={styles.child}>
        <Port {...item} />
      </View>
    )
  }

  // Wait for first connection
  if (initializing) return null;

  if (!ports) {
    return (
      <View>
        <Text>No ports</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SwiperFlatList
        //autoplay
        autoplayDelay={2}
        //autoplayLoop
        //index={2}
        showPagination
        style={{height: 250}}
        data={Object.keys(ports).map(key => {
          var obj = ports[key]
          return {
            key: key,
            device_id: props.device_id,
            slot: key,
            weight_kg: obj.weight_kg,
            status: obj.status,
            image_url: null,
            item: null,
          }
        })}
        renderItem={renderPort}
        //extraData={{ extraDataForMobX: devices.length > 0 ? devices[0].device : "" }}
        keyExtractor={(item: { key: any; }) => item.key}
      />
    </View>
  )
}
