import * as React from "react"
import { useState, useEffect } from "react"
import { observer, useObserver } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
import * as env from "../../environment-variables"
import { Text, View, ViewStyle, StyleSheet, Dimensions, Button } from "react-native"
import { Item } from "../item/item"
import { Meter } from "../../components"
import { HIDDEN } from "../../styles/common"
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
  dummyUserProp?: any
  dummyItemProp?: any
}

/**
 * Display list of user's items
 */
export const Items: React.FunctionComponent<ItemsProps> = (props) => {
  // grab the props
  const { tx, text, style, device_id, ...rest } = props
  //const textStyle = { }

  const { userStore, itemStore, itemDefinitionStore } = useStores()
  const [initializing, setInitializing] = useState(true);
  //const [items, setItems] = useState(null);
  //const [count, setCount] = useState(0);

  function onUserChange(snapshot) {
    //console.log("items: onUserChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    userStore.setUser(snapshot.val())
  }

  function onItemsChange(snapshot) {
    console.log("items: onItemsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    itemStore.updateItems(snapshot)
    //console.log("items: onItemsChange(): items: ", JSON.stringify(items, null, 2))
    console.log("items: onItemsChange(): itemStore.items: ", JSON.stringify(itemStore.items, null, 2))
    // Connection established
    //if (initializing) setInitializing(false);
  }

  useEffect(() => {
    //setCount(1)
    //console.log("items: props: ", props)
    //itemStore.clearItems()
    //itemDefinitionStore.getItemDefinitions();
    console.log("items: itemStore.items:", JSON.stringify(itemStore.items, null, 2))
    //console.log("items: itemDefinitionStore:", JSON.stringify(itemDefinitionStore, null, 2))

    // [eschwartz-TODO] hardcoded user id
    const ref = database().ref('/items').orderByChild('user_id').equalTo(env.HARDCODED_TEST_USER_ID);
    ref.on('value', onItemsChange);

    const ref2 = database().ref(`/users/${env.HARDCODED_TEST_USER_ID}`)
    ref2.on('value', onUserChange);

    // Unsubscribe from changes on unmount
    return () => {
      ref.off('value', onItemsChange)
      ref2.off('value', onUserChange)
    }



  }, []); // run once

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

  // if (!itemStore.items.length) {
  //   return (
  //     <View>
  //       <Text>No items</Text>
  //     </View>
  //   )
  // }

  return (
    <View style={styles.container}>
      {/*<Text style={HIDDEN}>userStore.user.meter: {userStore.user.meter}</Text>*/}
      <Meter />
      <SwiperFlatList
        //autoplay
        autoplayDelay={2}
        //autoplayLoop
        //index={2}
        showPagination
        //style={{}}
        data={itemStore.items}
        renderItem={renderItem}
        //extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
        //keyExtractor={(item: { key: any; }) => item.key}
      />
    </View>
  )

}
