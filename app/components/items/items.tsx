import * as React from "react"
import { useState, useEffect } from "react"
import { useStores } from "../../models/root-store"
import * as env from "../../environment-variables"
import { View, ViewStyle, StyleSheet, Dimensions, Text } from "react-native"
import { Item } from "../item/item"
import { UserSnapshot } from "../../models/user"
import { ItemSnapshot } from "../../models/item"
import { PortSnapshot } from "../../models/port"
import SwiperFlatList from 'react-native-swiper-flatlist';
import { BOLD, HIDDEN, BLACK, WHITE, FULL, HEADER, HEADER_CONTENT, HEADER_TITLE, MESSAGE } from "../../styles/common"

import database from '@react-native-firebase/database'

export const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  child: {
    height: height * 0.5,
    width
  },
  text: {
    fontSize: width * 0.5
  }
});
const LIST_STYLE: ViewStyle = {
}

export interface ItemsProps {
  /**
   * Use this optionally to filter query by device_id?
   */
  device_id?: string

  dummyUserProp?: any
  dummyItemProp?: any
  listType?: string
  vertical?: boolean
  showSlotHeader?: boolean

}

/**
 * Display list of user's items
 */
export const Items: React.FunctionComponent<ItemsProps> = (props) => {
  const { device_id, vertical, showSlotHeader, listType, ...rest } = props

  const { userStore, itemStore, itemDefinitionStore, portStore } = useStores()

  function onUserChange(snapshot: UserSnapshot) {
    //console.log("items: onUserChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    userStore.setUser(snapshot.val())
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    //console.log("items: onItemsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    itemStore.updateItems(snapshot)
    //console.log("items: onItemsChange(): items: ", JSON.stringify(items, null, 2))
    //console.log("items: onItemsChange(): itemStore.items: ", JSON.stringify(itemStore.items, null, 2))
  }

  function onPortsChange(snapshot: PortSnapshot[]) {
    console.log("items: onPortsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    portStore.updatePorts(snapshot)
  }

  useEffect(() => {
    //console.log("items: props: ", props)
    itemDefinitionStore.getItemDefinitions()
    // [eschwartz-TODO] Hardcoded user id
    portStore.getPorts(env.HARDCODED_TEST_USER_ID)
    //console.log("items: itemStore.items:", JSON.stringify(itemStore.items, null, 2))
    //console.log("items: itemDefinitionStore:", JSON.stringify(itemDefinitionStore, null, 2))

    // [eschwartz-TODO] hardcoded user id
    const itemsRef = database().ref('/items').orderByChild('user_id').equalTo(env.HARDCODED_TEST_USER_ID);
    itemsRef.on('value', onItemsChange);

    const userRef = database().ref(`/users/${env.HARDCODED_TEST_USER_ID}`)
    userRef.on('value', onUserChange);

    const portsRef = database().ref('/ports')
    portsRef.on('value', onPortsChange);

    // Unsubscribe from changes on unmount
    return () => {
      itemsRef.off('value', onItemsChange)
      userRef.off('value', onUserChange)
      portsRef.off('value', onPortsChange)
    }
  }, []); // run once

  const renderItem = ({ item }) => {
    //console.log("items: renderItem(): item: ", item)
    const matchFunction = (obj) => (obj.id == item.item_definition_id)
    let itemDefIndex = itemDefinitionStore.itemDefinitions.findIndex(matchFunction)
    //console.log("portStore.ports: ", portStore.ports)
    let portIndex = portStore.ports.findIndex((obj) => (obj.item_id == item.id))
    //console.log(`portIndex: ${portIndex}`)
    return (
      <View style={styles.child}>
        <Item
          buttonCallback={(e) => console.log("buttonCallback!")}
          buttonLabel={"item.moveToShelf"}
          showSlotHeader={showSlotHeader}
          {...item}
          item_definition={itemDefinitionStore.itemDefinitions[itemDefIndex]}
          port={portStore.ports[portIndex]}
        />
      </View>
    )
  }

  if (!itemStore.items.length) {
    return (
      <View>
        <Text>No items</Text>
      </View>
    )
  }

  let data = itemStore.items
  if (listType == "active") {
    data = data.filter((item) => ((item.device_id != "") && (item.slot > -1)))
  } else if (listType == "inactive") {
    data = data.filter((item) => !((item.device_id != "") && (item.slot > -1)))
  } else if (listType == "all") {
    // default, no filter
  }


  return (
    <View style={styles.container}>
      { !data.length && (
        <View style={MESSAGE}>
          <Text>No items</Text>
        </View>
      )}
      { (data.length > 0) && (
        <SwiperFlatList
          vertical={vertical}
          showPagination
          style={LIST_STYLE}
          data={data}
          renderItem={renderItem}
          //extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
          //keyExtractor={(item: { key: any; }) => item.key}
        />
      )}
    </View>
  )
}
