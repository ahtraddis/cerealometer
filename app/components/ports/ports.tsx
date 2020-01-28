import * as React from "react"
import { useEffect, useState } from "react"
import { Observer } from 'mobx-react-lite'
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/root-store"
import * as env from "../../environment-variables"
import { View, ViewStyle, StyleSheet, Dimensions, Text } from "react-native"
import { Port } from "../port/port"
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
const LIST_STYLE: ViewStyle = {}
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
  const [count, setCount] = useState(0)

  function onUserChange(snapshot: UserSnapshot) {
    //console.log("ports: onUserChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    userStore.setUser(snapshot.val())
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    //console.log("ports: onItemsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    itemStore.updateItems(snapshot)
  }

  function onPortsChange(snapshot: PortSnapshot[]) {
    console.log("ports: onPortsChange() fired, snapshot:", JSON.stringify(snapshot, null, 2))
    portStore.updatePorts(snapshot)
  }

  useEffect(() => {
    itemDefinitionStore.getItemDefinitions()
    //console.log("ports: itemDefinitionStore.item_definitions:", JSON.stringify(itemDefinitionStore.item_definitions, null, 2))

    // [eschwartz-TODO] Hardcoded user id
    //portStore.getPorts(env.HARDCODED_TEST_USER_ID)

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
    // refresh both ports and item defs
    console.log("ports: onRefresh(): fetching ports and itemDefinitions")
    setRefreshing(true)
    // [eschwartz-TODO] Hardcoded user id
    await portStore.getPorts(env.HARDCODED_TEST_USER_ID)
    await itemDefinitionStore.getItemDefinitions()
    setRefreshing(false)
  }

  const EmptyMessage: React.FunctionComponent = observer((props) => {
    return (
      <View>
        { !portStore.ports.length && (
          <View style={MESSAGE}>
            <Text style={MESSAGE_TEXT}>{emptyMessage || "No ports."}</Text>
          </View>
        )}
      </View>
    )
  })

  let data = portStore.ports
  return (
    <View style={styles.container}>
      <EmptyMessage />
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
          renderItem={renderPort}
          //extraData={{ extraDataForMobX: itemStore.items.length > 0 ? itemStore.items[0] : "" }}
          //keyExtractor={(item: { key: any; }) => item.key}
        />
        }
      </Observer>
    </View>
  )
}