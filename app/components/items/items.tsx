import * as React from "react"
import { useState, useEffect } from "react"
import { useStores } from "../../models/root-store"
import { View, ViewStyle, StyleSheet, Dimensions } from "react-native"
import { Text } from "../"
import { Item } from "../item/item"
import SwiperFlatList from 'react-native-swiper-flatlist';

import database from '@react-native-firebase/database'

export const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 250,
    backgroundColor: 'green'
  },
  child: {
    height: height * 0.5,
    width
  },
  text: {
    fontSize: width * 0.5
  }
});

export interface ItemsProps {
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

  device_id: string
}

/**
 * Display list of user's items
 */
export const Items: React.FunctionComponent<ItemsProps> = (props) => {
  // grab the props
  const { tx, text, style, device_id, ...rest } = props
  //const textStyle = { }

  const { itemDefinitionStore } = useStores()
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
  }, [props.device_id]); // dummy value

  const renderItem = ({ item }) => {
    const matchFunction = (element) => (element.item_definition_id == item.item_definition_id)
    let matchIndex = itemDefinitionStore.itemDefinitions.findIndex(matchFunction)
    return (
      <View style={styles.child}>
        <Item
          {...item}
          item_definition={itemDefinitionStore.itemDefinitions[matchIndex]}
        />
      </View>
    )
  }

  // Wait for first connection
  if (initializing) return null;

  if (!items) {
    return (
      <View>
        <Text>No items</Text>
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
        style={{}}
        data={Object.keys(items).map((key, index) => {
          var obj = items[key]
          return {
            key: key,
            device_id: props.device_id,
            item_definition_id: obj.item_definition_id,
            last_known_weight_kg: obj.last_known_weight_kg,
            last_checkin: obj.last_checkin,
            slot: obj.slot,
            user_id: obj.user_id, // prob won't need this
          }
        })}
        renderItem={renderItem}
        //extraData={{ extraDataForMobX: devices.length > 0 ? devices[0].device : "" }}
        keyExtractor={(item: { key: any; }) => item.key}
      />
    </View>
  )
}
