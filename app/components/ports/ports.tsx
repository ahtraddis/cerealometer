import * as React from "react"
import { useEffect, useState } from "react"
import { Observer } from 'mobx-react-lite'
import { useStores } from "../../models/root-store"
import { View, StyleSheet, Dimensions, Text } from "react-native"
import { Port } from "../port/port"
import { color } from "../../theme/color"
import { EMPTY_MESSAGE, EMPTY_LOADER_VIEW, EMPTY_MESSAGE_TEXT } from "../../styles/common"
import { UserSnapshot } from "../../models/user"
import { ItemSnapshot } from "../../models/item"
import { PortSnapshot } from "../../models/port"
import SwiperFlatList from 'react-native-swiper-flatlist';
import database from '@react-native-firebase/database'
import * as Progress from 'react-native-progress'

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
  },
  paginationStyleItem: {
    borderColor: color.palette.cheerio,
    borderWidth: 6,
    padding: 5,
    shadowRadius: 1,
    marginBottom: 10,
  },
});

export interface PortsProps {
  /**
   * Use this optionally to filter query by device_id?
   */
  device_id?: string
  vertical?: boolean
  emptyMessage?: string
}

/**
 * Display list of user's ports
 */
export const Ports: React.FunctionComponent<PortsProps> = (props) => {
  const {
    device_id,
    vertical,
    emptyMessage,
    ...rest
  } = props

  const { userStore, itemStore, itemDefinitionStore, portStore, deviceStore, messageStore } = useStores()
  const [refreshing, setRefreshing] = useState(false)

  function onUserChange(snapshot: UserSnapshot) {
    __DEV__ && console.tron.log("ports: onUserChange()")
    userStore.setUser(snapshot.val())
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    __DEV__ && console.tron.log("ports: onItemsChange()")
    itemStore.updateItems(snapshot)
  }

  function onPortsChange(snapshot: PortSnapshot[]) {
    __DEV__ && console.tron.log("ports: onPortsChange()")
    portStore.updatePorts(snapshot)
  }

  useEffect(() => {
    let refSet, itemsRef, userRef, portsRef
    if (userStore.user.isLoggedIn) {
      refSet = true
      let uid = userStore.user.uid
      //itemDefinitionStore.getItemDefinitions(uid)
      //portStore.getPorts(uid)

      itemsRef = database().ref('/items').orderByChild('user_id').equalTo(uid);
      itemsRef.on('value', onItemsChange);

      userRef = database().ref(`/users/${uid}`)
      userRef.on('value', onUserChange);

      portsRef = database().ref('/ports').orderByChild('user_id').equalTo(uid);
      portsRef.on('value', onPortsChange);
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

  // note: { item } here is the Port being rendered
  const renderPort = ({ item }) => {
    let itemInstance = item.item_id ? itemStore.items.find(i => (i.id == item.item_id)) : null
    let itemDefinition = itemInstance ? itemDefinitionStore.itemDefinitions.find(i => (i.id == itemInstance.item_definition_id)) : null
    let device = deviceStore.devices.find((device) => (device.id == item.device_id))

    return (
      <View style={styles.child}>
        <Port
          port={item}
          item={itemInstance}
          itemDefinition={itemDefinition}
          device={device}
        />
      </View>
    )
  }

  const onRefresh = async() => {
    if (userStore.user.isLoggedIn) {
      let uid = userStore.user.uid
      setRefreshing(true)
      await itemDefinitionStore.getItemDefinitions(uid) // get first to avoid flash of "Unknown Item" on first load
      await deviceStore.getDevices(uid)
      await portStore.getPorts(uid)
      await itemStore.getItems(uid)
      await messageStore.getMessages(uid)
      setRefreshing(false)
    }
  }

  const EmptyMessage = () => {
    return (
      <View>
        <View style={EMPTY_MESSAGE}>
          <View style={EMPTY_LOADER_VIEW}>
            <Progress.Circle
              color={'#fff'}
              size={14}
              indeterminate={true} />
          </View>
          <View>
            <Text style={EMPTY_MESSAGE_TEXT}>{emptyMessage || "No ports."}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Observer>
        { () => 
          <SwiperFlatList
            onRefresh={onRefresh}
            refreshing={refreshing}
            vertical={vertical}
            showPagination
            paginationStyleItem={styles.paginationStyleItem}
            paginationDefaultColor={'transparent'}
            paginationActiveColor={color.palette.cheerioCenter}
            data={portStore.ports}
            //data={[{device_id: "-LxNyE47HCaN9ojmR3D2", slot: 1, last_update_time: 0, status: 'VACANT', weight_kg: 0.1234}]}
            ListEmptyComponent={EmptyMessage}
            renderItem={renderPort}
            extraData={{ extraDataForMobX: portStore.ports.length > 0 ? portStore.ports[0] : "" }}
            keyExtractor={port => (port.device_id + port.slot)}
          />
        }
      </Observer>
    </View>
  )
}