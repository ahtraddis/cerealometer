import * as React from "react"
import { useEffect, useState } from "react"
import { observer } from 'mobx-react-lite'
import { observable } from "mobx"
import { useStores } from "../../models/root-store"
import { View, FlatList, Image } from "react-native"
import { Text } from "../"
import { styles } from "./items.styles"
import { Item } from "../item/item"
import { color } from "../../theme/color"
const cheerioImg = require("../../static/cheerio.png") 
import { UserSnapshot } from "../../models/user"
import { ItemSnapshot } from "../../models/item"
import { PortSnapshot } from "../../models/port"
import SwiperFlatList from 'react-native-swiper-flatlist';
import database from '@react-native-firebase/database'

export interface ItemsProps {
  /**
   * Use this optionally to filter query by device_id?
   */
  device_id?: string

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
    //__DEV__ && console.tron.log("items: onUserChange()")
    userStore.setUser(snapshot)
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    //__DEV__ && console.tron.log("items: onItemsChange()")
    itemStore.updateItems(snapshot)
    setCount(count + 1) // hack to force rerender
  }

  function onPortsChange(snapshot: PortSnapshot[]) {
    //__DEV__ && console.tron.log("items: onPortsChange()")
    portStore.updatePorts(snapshot)
  }

  useEffect(() => {
    let refSet, itemsRef, userRef, portsRef
    console.tron.log("items.tsx: itemStore.items: ", itemStore.items)
    if (userStore.user.isLoggedIn) {
      refSet = true
      const uid = userStore.user.uid
      itemDefinitionStore.getItemDefinitions(uid)
      //portStore.getPorts(uid)
      itemsRef = database().ref('/items').orderByChild('user_id').equalTo(uid);
      //itemsRef.on('value', onItemsChange);

      userRef = database().ref(`/users/${uid}`)
      //userRef.on('value', onUserChange);

      portsRef = database().ref('/ports').orderByChild('user_id').equalTo(uid);
      //portsRef.on('value', onPortsChange);
    }
    if (refSet) {
      // Unsubscribe from changes on unmount
      return () => {
        itemsRef.off('value', onItemsChange)
        userRef.off('value', onUserChange)
        portsRef.off('value', onPortsChange)
      }
    }
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
    //__DEV__ && console.tron.log("onRefresh()")    
    if (userStore.user.isLoggedIn) {
      let uid = userStore.user.uid
      setRefreshing(true)
      await itemDefinitionStore.getItemDefinitions(uid) // get first
      await portStore.getPorts(uid)
      await itemStore.getItems(uid)
      setRefreshing(false)
    }
  }

  const EmptyMessage = () => {
    return (
      <View style={styles.empty}>
        <Image style={{width: 50, height: 50, opacity: .5, marginBottom: 10}} source={cheerioImg} />
        <Text
          style={styles.noItemsTitle}
          tx={"items.noItemsTitle"}
        />
        <Text
          style={styles.noItemsText}
          tx={"items.noItemsMessage"}
        />
      </View>
    )
  }

  //let data = itemStore.items
  let data = (itemStore && itemStore.items && (itemStore.items.length > 0)) ? itemStore.items : []
  // if (listType == "active") {
  //   data = data.filter((item) => portStore.ports.find((port) => (port.item_id == item.id)))
  // } else if (listType == "inactive") {
  //   data = data.filter((item) => !portStore.ports.find((port) => (port.item_id == item.id)))
  // } else if (listType == "all") {
  //   // default, no filter
  // }

  var itemData = observable({
    items: itemStore.items,
    counter: 0
  })

  setInterval(() => {
    itemData.counter++ // [eschwartz-TODO] Hack, fix me
  }, 1000)
    
  const ListComponent = observer(({itemData}) => {
    // [eschwartz-TODO] Observed changes on item data is not working. Accessing other changing data
    // (counter) on same observable object as a workaround to force re-render.
    var access = itemData.counter
    return (
      <View>
        { vertical ? (
          <FlatList
            onRefresh={onRefresh}
            refreshing={refreshing}
            data={itemData.items}
            ListEmptyComponent={EmptyMessage}
            renderItem={renderItem}
            extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
            keyExtractor={item => item.id}
        />
        ) : (
          <SwiperFlatList
            onRefresh={onRefresh}
            refreshing={refreshing}
            vertical={vertical}
            showPagination
            paginationStyleItem={styles.paginationStyleItem}
            paginationDefaultColor={'transparent'}
            paginationActiveColor={color.palette.cheerioCenter}
            data={itemData.items}
            ListEmptyComponent={EmptyMessage}
            renderItem={renderItem}
            extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    )
  })

  return (
    <View style={styles.container}>
      <ListComponent itemData={itemData} />
    </View>
  )

}