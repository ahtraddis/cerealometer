import * as React from "react"
import { useState, useEffect } from "react"
import { observer, useObserver } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
import * as env from "../../environment-variables"
import { Text, View, ViewStyle, StyleSheet, Dimensions } from "react-native"
import { Item } from "../item/item"
import SwiperFlatList from 'react-native-swiper-flatlist';

import database from '@react-native-firebase/database'

export const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //height: 250,
    //backgroundColor: 'green'
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

  /**
   * Use this optionally to filter query by device_id?
   */
  device_id?: string
}

/**
 * Display list of user's items
 */
export const Items: React.FunctionComponent<ItemsProps> = (props) => {
  // grab the props
  const { tx, text, style, device_id, ...rest } = props
  //const textStyle = { }

  const { itemStore, itemDefinitionStore } = useStores()
  const [initializing, setInitializing] = useState(true);
  const [items, setItems] = useState(null);

  function onItemsChange(snapshot) {
    console.log(`items: onItemsChange() fired`, snapshot);
    //setItems(snapshot.val());
    itemStore.updateItems(snapshot)
    //console.log("items: onItemsChange(): items: ", JSON.stringify(items, null, 2))
    //console.log("items: onItemsChange(): itemStore: ", JSON.stringify(itemStore));
    // Connection established
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    //console.log("items: props: ", props)
    //itemDefinitionStore.getItemDefinitions();
    console.log("items: itemStore:", JSON.stringify(itemStore, null, 2))
    //console.log("items: itemDefinitionStore:", JSON.stringify(itemDefinitionStore, null, 2))

    // [eschwartz-TODO] hardcoded email
    const ref = database().ref('/items').orderByChild('user_id').equalTo(env.HARDCODED_TEST_USER_ID);
    ref.on('value', onItemsChange);
    // Unsubscribe from changes on unmount
    return () => ref.off('value', onItemsChange);
  }, [props.device_id]); // dummy value

  const renderItem = ({ item }) => {
    //console.log("items: renderItem(): item: ", item)
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
  //if (initializing) return null;

  if (!itemStore.items.length) {
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
        data={itemStore.items}
        renderItem={renderItem}
        //extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
        //keyExtractor={(item: { key: any; }) => item.key}
      />
    </View>
  )

}
