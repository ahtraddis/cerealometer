import * as React from "react"
import { useState, useEffect } from 'react'
import { useStores } from "../../models/root-store"
import { View, ViewStyle, ImageStyle, TextStyle, StyleSheet, SafeAreaView, Image, Dimensions } from "react-native"
import { Text, Icon } from "../"
import { spacing } from "../../theme"
import { Item } from "../item/item"
import { ScrollItem } from "../../components"
//import Swiper from 'react-native-swiper'
import SwiperFlatList from 'react-native-swiper-flatlist';

import database from '@react-native-firebase/database'

const ITEMS: ViewStyle = {
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

export interface ItemsProps extends NavigationScreenProps<{}> {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  device_id: string,

  //deviceStore: DeviceStore,
  //itemDefinitionStore: ItemDefinitionStore,
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export const Items: React.FunctionComponent<ItemsProps> = props => {

  const { deviceStore, itemDefinitionStore } = useStores()

  // grab the props
  const { tx, text, style, ...rest } = props
  const textStyle = { }

  const [initializing, setInitializing] = useState(true);
  const [items, setItems] = useState(null);

  function onItemsChange(snapshot) {
    console.log(`onItemsChange fired:`, snapshot);
    setItems(snapshot.val());
    // Connection established
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    //console.log("items.tsx: props: ", props)
    //itemDefinitionStore.getItemDefinitions();
    //console.log("deviceStore: ", JSON.stringify(deviceStore));
    //console.log("itemDefinitionStore: ", JSON.stringify(itemDefinitionStore));

    // [eschwartz-TODO] mount all items for now (don't care about device or user yet)
    const ref = database().ref(`/items`);
    ref.on('value', onItemsChange);

    // Unsubscribe from changes on unmount
    return () => ref.off('value', onItemsChange);
  }, [props.deviceId]); // dummy value
 
  const renderItem = ({ item }) => {
    const matchFunction = (element) => (element.item_definition_id == item.item_definition)
    let matchIndex = itemDefinitionStore.itemDefinitions.findIndex(matchFunction)
    return (
      <View style={styles.child}>
        <Item {...item} item_definition_obj={itemDefinitionStore.itemDefinitions[matchIndex]} />
      </View> 
    )
  }

  // Wait for first connection
  if (initializing) return null;

  if (!items) {
    return <View><Text>No items</Text></View>
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
        data={Object.keys(items).map((key, index) => {
          var obj = items[key]
          return {
            key: key,
            device_id: props.device_id,
            item_definition: obj.item_definition,
            last_known_weight_kg: obj.last_known_weight_kg,
            slot: obj.slot,
            user: obj.user, // prob won't need this
          }
        })}
        renderItem={renderItem}
        //extraData={{ extraDataForMobX: devices.length > 0 ? devices[0].device : "" }}
        keyExtractor={item => item.key}
      />
    </View> 
  )
}
