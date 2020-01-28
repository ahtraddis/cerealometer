import * as React from "react"
import { useEffect, useState } from "react"
import { Observer } from 'mobx-react-lite'
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

const { width, height } = Dimensions.get('window');
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
const PAGINATION_STYLE_ITEM = {
  borderColor: '#B38530',
  borderWidth: 6,
  padding: 5,
  shadowRadius: 1,
  marginBottom: 10
}
const MESSAGE: ViewStyle = {
  backgroundColor: color.palette.darkPurple,
  padding: 15,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 10
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
  emptyMessage?: string
}

/**
 * Display list of user's items
 */
export const Items: React.FunctionComponent<ItemsProps> = (props) => {
  const { device_id, vertical, listType, emptyMessage, ...rest } = props

  const { userStore, itemStore, itemDefinitionStore, portStore, deviceStore } = useStores()
  const [refreshing, setRefreshing] = useState(false)
  const [count, setCount] = useState(0)

  function onUserChange(snapshot: UserSnapshot) {
    //console.log("items: onUserChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    userStore.setUser(snapshot.val())
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    //console.log("items: onItemsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    itemStore.updateItems(snapshot)
    setCount(count + 1) // hack to force rerender
  }

  function onPortsChange(snapshot: PortSnapshot[]) {
    console.log("items: onPortsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    portStore.updatePorts(snapshot)
  }

  useEffect(() => {
    itemDefinitionStore.getItemDefinitions()
    //console.log("items: itemDefinitionStore.item_definitions:", JSON.stringify(itemDefinitionStore.item_definitions, null, 2))
    // [eschwartz-TODO] Hardcoded user id
    portStore.getPorts(env.HARDCODED_TEST_USER_ID)

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
    //console.log("item: item: ", item)
    let itemDefinition = itemDefinitionStore.itemDefinitions.find(itemdef => (itemdef.id == item.item_definition_id))
    let port = portStore.ports.find((port) => (port.item_id == item.id))
    let device = port ? deviceStore.devices.find((device) => (device.id == port.device_id)) : null

    return (
      <View style={styles.child}>
        <Item
          {...item}
          itemDefinition={itemDefinition}
          port={port}
          device={device}
        />
      </View>
    )
  }

  const onRefresh = async() => {
    //console.log("items: onRefresh(), fetching item definitions")
    setRefreshing(true)
    let result = await itemDefinitionStore.getItemDefinitions()
    //console.log("items: itemDefinitionStore.itemDefinitions: ", JSON.stringify(itemDefinitionStore.itemDefinitions, null, 2))
    setRefreshing(false)
  }

  let data = itemStore.items
  // if (listType == "active") {
  //   data = data.filter((item) => portStore.ports.find((port) => (port.item_id == item.id)))
  // } else if (listType == "inactive") {
  //   data = data.filter((item) => !portStore.ports.find((port) => (port.item_id == item.id)))
  // } else if (listType == "all") {
  //   // default, no filter
  // }

  return (
    <View style={styles.container}>
      { !data.length && (
        <View style={MESSAGE}>
          <Text style={MESSAGE_TEXT}>{emptyMessage || "No items."}</Text>
        </View>
      )}
      <Observer>{ () => 
        <SwiperFlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          vertical={vertical}
          showPagination
          //renderAll={true}
          style={LIST_STYLE}
          paginationStyleItem={PAGINATION_STYLE_ITEM}
          paginationDefaultColor={'transparent'}
          paginationActiveColor={'#8f6a26'}
          data={data}
          renderItem={renderItem}
          //extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
          //keyExtractor={(item: { key: any; }) => item.key}
        />
        }
      </Observer>
    </View>
  )
}