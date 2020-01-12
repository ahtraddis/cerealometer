import * as React from "react"
import { useState, useEffect } from 'react'
import { View, ViewStyle, ImageStyle, TextStyle, StyleSheet, SafeAreaView, Image, Dimensions } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"
import { Port } from "../port/port"
import { ScrollItem } from "../../components"
import SwiperFlatList from 'react-native-swiper-flatlist';

import database from '@react-native-firebase/database'

const PORTS: ViewStyle = {
  backgroundColor: "#555",
}
export const { width, height } = Dimensions.get('window');
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
  }, [props.deviceId]);
 
  renderPort = ({ item }) => {
    const port: Port = item
    //console.log("item: ", item)
    return (
      <View style={styles.child}>
        <Port {...item} />
      </View> 
    )
  }

  // Wait for first connection
  if (initializing) return null;

  if (!ports) {
    return <View><Text>No ports</Text></View>
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
        data={Object.keys(ports).map((key, index) => {
          var obj = ports[key]
          return {
            key: key,
            device_id: props.device_id,
            slot: key,
            weight_kg: obj.weight_kg,
            status: obj.status,
            "image_url": "https://target.scene7.com/is/image/Target/GUEST_baea4245-eb06-48df-be09-bfec71994861?wid=1000&hei=1000",
            "item": {
              "brand":"Chex","description":"Peanut Butter Chex Cereal, Gluten Free, 20 oz","image_url":"https://i5.walmartimages.com/asr/f6a51049-73b0-487a-b2c0-2d8e9aeb7b22_1.3954a6f2d22eacc575662819850e9042.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff","name":"Peanut Butter Chex","upc":"016000144316","weight_grams":567
            }
          }
        })}
        renderItem={renderPort}
        //extraData={{ extraDataForMobX: devices.length > 0 ? devices[0].device : "" }}
        keyExtractor={item => item.key}
      />
    </View> 
  )
}
