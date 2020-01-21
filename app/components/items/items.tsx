import * as React from "react"
import { useEffect } from "react"
import { useStores } from "../../models/root-store"
import * as env from "../../environment-variables"
import { View, ViewStyle, StyleSheet, Dimensions, Text } from "react-native"
import { Item } from "../item/item"
import { color } from "../../theme/color"
import { UserSnapshot } from "../../models/user"
import { ItemSnapshot } from "../../models/item"
import { PortSnapshot } from "../../models/port"
import { MESSAGE_TEXT } from "../../styles/common"
import SwiperFlatList from 'react-native-swiper-flatlist';
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
const MESSAGE: ViewStyle = {
  backgroundColor: color.palette.darkPurple,
  padding: 20,
}

export interface ItemsProps {
  /**
   * Use this optionally to filter query by device_id?
   */
  device_id?: string

  dummyUserProp?: any
  dummyItemProp?: any
  dummyPortProp?: any
  listType?: string
  vertical?: boolean
  showSlotHeader?: boolean
  emptyMessage?: string
}

/**
 * Display list of user's items
 */
export const Items: React.FunctionComponent<ItemsProps> = (props) => {
  const { device_id, vertical, showSlotHeader, listType, emptyMessage, ...rest } = props

  const { userStore, itemStore, itemDefinitionStore, portStore, deviceStore } = useStores()

  function onUserChange(snapshot: UserSnapshot) {
    //console.log("items: onUserChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    userStore.setUser(snapshot.val())
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    //console.log("items: onItemsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    itemStore.updateItems(snapshot)
    //console.log("items: onItemsChange(): itemStore.items: ", JSON.stringify(itemStore.items, null, 2))
  }

  function onPortsChange(snapshot: PortSnapshot[]) {
    //console.log("items: onPortsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    portStore.updatePorts(snapshot)
  }

  useEffect(() => {
    itemDefinitionStore.getItemDefinitions()
    //console.log("items: itemDefinitionStore.item_definitions:", JSON.stringify(itemDefinitionStore.item_definitions, null, 2))
    // [eschwartz-TODO] Hardcoded user id
    portStore.getPorts(env.HARDCODED_TEST_USER_ID)
    //console.log("items: itemStore.items:", JSON.stringify(itemStore.items, null, 2))

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


  const clearPortItem = async(item_id) => {
    const port = portStore.ports.find((port) => (port.item_id == item_id))
    console.log("clearPortItem: found port to clear: ", port)
    let result = await portStore.clearPortItem(port.device_id, port.slot)
    console.log("clearPortItem result: ", result)
  }

  const setPortItem = async(item_id) => {
    const vacantPort = portStore.ports.find((port) => (port.status == 'VACANT'))
    if (vacantPort) {
      console.log("setPortItem: found vacant port: ", vacantPort)
      let result = await portStore.setPortItem(vacantPort.device_id, vacantPort.slot, item_id)
      console.log("setPortItem result: ", result)
    }
  }

  const renderItem = ({ item }) => {
    //console.log("items: renderItem(): item: ", item)
    let itemDefinition = itemDefinitionStore.itemDefinitions.find(itemdef => (itemdef.id == item.item_definition_id))
    let port = portStore.ports.find((port) => (port.item_id == item.id))
    let device = port ? deviceStore.devices.find((device) => (device.id == port.device_id)) : null

    const vacantPort = portStore.ports.find((port) => (port.status == 'VACANT'))

    return (
      <View style={styles.child}>
        <Item
          {...item}
          itemDefinition={itemDefinition}
          port={port}
          device={device}
          showSlotHeader={showSlotHeader}
          buttonEnabled={port || vacantPort}
          buttonCallback={port ? clearPortItem : setPortItem}
          buttonLabel={port ? "item.removeFromShelf" : "item.addToShelf" + ((port || vacantPort) ? '' : 'Disabled')}
        />
      </View>
    )
  }

  let data = itemStore.items
  if (listType == "active") {
    data = data.filter((item) => portStore.ports.find((port) => (port.item_id == item.id)))
  } else if (listType == "inactive") {
    data = data.filter((item) => !portStore.ports.find((port) => (port.item_id == item.id)))
  } else if (listType == "all") {
    // default, no filter
  }


  return (
    <View style={styles.container}>
      { !data.length && (
        <View style={MESSAGE}>
          <Text style={MESSAGE_TEXT}>{emptyMessage || "No items."}</Text>
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
