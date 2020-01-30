import * as React from "react"
import { useEffect, useState } from "react"
import { Observer } from 'mobx-react-lite'
import { useStores } from "../../models/root-store"
import * as env from "../../environment-variables"
import { View, StyleSheet, Dimensions, Text } from "react-native"
import { Item } from "../item/item"
import { color } from "../../theme/color"
import { UserSnapshot } from "../../models/user"
import { ItemSnapshot } from "../../models/item"
import { PortSnapshot } from "../../models/port"
import { EMPTY_MESSAGE, EMPTY_MESSAGE_TEXT } from "../../styles/common"
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
const PAGINATION_STYLE_ITEM = {
  borderColor: color.palette.cheerio,
  borderWidth: 6,
  padding: 5,
  shadowRadius: 1,
  marginBottom: 10
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
    __DEV__ && console.tron.log("items: onUserChange()")
    userStore.setUser(snapshot)
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    __DEV__ && console.tron.log("items: onItemsChange()")
    itemStore.updateItems(snapshot)
    setCount(count + 1) // hack to force rerender
  }

  function onPortsChange(snapshot: PortSnapshot[]) {
    __DEV__ && console.tron.log("items: onPortsChange()")
    portStore.updatePorts(snapshot)
  }

  useEffect(() => {
    // [eschwartz-TODO] Hardcoded user id
    //itemDefinitionStore.getItemDefinitions(env.HARDCODED_TEST_USER_ID)
    //portStore.getPorts(env.HARDCODED_TEST_USER_ID)

    // [eschwartz-TODO] hardcoded user id
    const itemsRef = database().ref('/items').orderByChild('user_id').equalTo(env.HARDCODED_TEST_USER_ID);
    //itemsRef.on('value', onItemsChange);

    const userRef = database().ref(`/users/${env.HARDCODED_TEST_USER_ID}`)
    //userRef.on('value', onUserChange);

    const portsRef = database().ref('/ports').orderByChild('user_id').equalTo(env.HARDCODED_TEST_USER_ID);
    //portsRef.on('value', onPortsChange);

    // Unsubscribe from changes on unmount
    // return () => {
    //   itemsRef.off('value', onItemsChange)
    //   userRef.off('value', onUserChange)
    //   portsRef.off('value', onPortsChange)
    // }
  }, []);

  const renderItem = ({ item }) => {
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
    __DEV__ && console.tron.log("onRefresh()")
    setRefreshing(true)
    
    // [eschwartz-TODO] Hardcoded user id
    await itemDefinitionStore.getItemDefinitions(env.HARDCODED_TEST_USER_ID) // get first
    await portStore.getPorts(env.HARDCODED_TEST_USER_ID)
    await itemStore.getItems(env.HARDCODED_TEST_USER_ID)
    setRefreshing(false)
  }

  const EmptyMessage = () => {
    return (
      <View>
        <View style={EMPTY_MESSAGE}>
          <View>
            <Text style={EMPTY_MESSAGE_TEXT}>{emptyMessage || "No ports."}</Text>
          </View>
        </View>
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
      <Observer>{ () => 
        <SwiperFlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          vertical={vertical}
          showPagination
          paginationStyleItem={PAGINATION_STYLE_ITEM}
          paginationDefaultColor={'transparent'}
          paginationActiveColor={color.palette.cheerioCenter}
          data={data}
          ListEmptyComponent={EmptyMessage}
          renderItem={renderItem}
          //extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
          //keyExtractor={(item: { key: any; }) => item.key}
        />
        }
      </Observer>
    </View>
  )
}