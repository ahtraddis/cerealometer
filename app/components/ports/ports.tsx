import * as React from "react"
import { useEffect, useState } from "react"
import { Observer, observer } from 'mobx-react-lite'
import { useStores } from "../../models/root-store"
import * as env from "../../environment-variables"
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
  }
});
const PAGINATION_STYLE_ITEM = {
  borderColor: color.palette.cheerio,
  borderWidth: 6,
  padding: 5,
  shadowRadius: 1,
  marginBottom: 10
}



export interface PortsProps {
  /**
   * Use this optionally to filter query by device_id?
   */
  device_id?: string
  vertical?: boolean
  emptyMessage?: string
  //
  dummyUserProp?: any
  dummyItemProp?: any
  dummyPortProp?: any
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

  const { userStore, itemStore, itemDefinitionStore, portStore, deviceStore } = useStores()
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
    // [eschwartz-TODO] Hardcoded user id
    //itemDefinitionStore.getItemDefinitions(env.HARDCODED_TEST_USER_ID)
    //portStore.getPorts(env.HARDCODED_TEST_USER_ID)

    // [eschwartz-TODO] hardcoded user id
    const itemsRef = database().ref('/items').orderByChild('user_id').equalTo(env.HARDCODED_TEST_USER_ID);
    itemsRef.on('value', onItemsChange);

    const userRef = database().ref(`/users/${env.HARDCODED_TEST_USER_ID}`)
    userRef.on('value', onUserChange);

    const portsRef = database().ref('/ports').orderByChild('user_id').equalTo(env.HARDCODED_TEST_USER_ID);
    portsRef.on('value', onPortsChange);

    // Unsubscribe from changes on unmount
    return () => {
      itemsRef.off('value', onItemsChange)
      userRef.off('value', onUserChange)
      portsRef.off('value', onPortsChange)
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
    __DEV__ && console.tron.log("onRefresh()")
    // refresh ports, item defs, and items
    setRefreshing(true)
    // [eschwartz-TODO] Hardcoded user id
    await itemDefinitionStore.getItemDefinitions(env.HARDCODED_TEST_USER_ID) // get first to avoid flash of "Unknown Item" on first load
    await portStore.getPorts(env.HARDCODED_TEST_USER_ID)
    await itemStore.getItems(env.HARDCODED_TEST_USER_ID)
    
    setRefreshing(false)
  }

  const EmptyMessage = () => {
    return (
      <View>
        <View style={EMPTY_MESSAGE}>
          <View style={EMPTY_LOADER_VIEW}>
            <Progress.Circle color={'#fff'} size={14} indeterminate={true} />
          </View>
          <View>
            <Text style={EMPTY_MESSAGE_TEXT}>{emptyMessage || "No ports."}</Text>
          </View>
        </View>
      </View>
    )
  }

  let data = portStore.ports
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
          renderItem={renderPort}
          //extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
          //keyExtractor={(item: { key: any; }) => item.key}
        />
        }
      </Observer>
    </View>
  )
}