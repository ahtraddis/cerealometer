import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { observer } from 'mobx-react-lite'
import { observable } from "mobx"
import { useStores } from "../../models/root-store"
import { View, Text, Image, TouchableHighlight } from "react-native"
import { Port } from "../port/port"
import { color } from "../../theme/color"
import { EMPTY_MESSAGE, EMPTY_LOADER_VIEW, EMPTY_MESSAGE_TEXT } from "../../styles/common"
import { styles } from "./ports.styles"
import { UserSnapshot } from "../../models/user"
import { ItemSnapshot } from "../../models/item"
import { PortSnapshot } from "../../models/port"
import SwiperFlatList from 'react-native-swiper-flatlist';
import database from '@react-native-firebase/database'
import { Icon } from 'react-native-elements'
import * as Progress from 'react-native-progress'
var _ = require('underscore');

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef(null)

  function onUserChange(snapshot: UserSnapshot) {
    //__DEV__ && console.tron.log("ports: onUserChange()")
    userStore.setUser(snapshot.val())
  }

  function onItemsChange(snapshot: ItemSnapshot[]) {
    //__DEV__ && console.tron.log("ports: onItemsChange()")
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
      itemDefinitionStore.getItemDefinitions(uid)
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

  var portData = observable({
    ports: portStore.ports,
    counter: 0,
  })

  setInterval(() => {
    portData.counter++ // workaround
  }, 1000)

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

  const indexChanged = ({ index, prevIndex }) => {
    console.tron.log({ index, prevIndex })
    setCurrentIndex(index)
  };

  const scrollToSlot = (slot) => {
    if (sliderRef && sliderRef.current) {
      sliderRef.current.scrollToIndex({index: slot, animated: true});
    }
  }

  const Shelf = observer(({portData}) => {
    var access = portData.counter

    return (
      <View style={styles.shelf}>
        { portData.ports.map((port, index) => {
          let itemInstance = port.item_id ? itemStore.items.find(i => (i.id == port.item_id)) : null
          let itemDef = itemInstance ? itemDefinitionStore.itemDefinitions.find(i => (i.id == itemInstance.item_definition_id)) : null

          let isSelected = (sliderRef && sliderRef.current && (sliderRef.current.getCurrentIndex() == port.slot))
          let thumb = (itemDef && (itemDef.image_url != "")) ?
            <Image style={styles.image} source={{uri: itemDef.image_url}}/> :
            <Icon
              type='material-community'
              color='#ddd'
              size={40}
              name='bowl' />

          return (
            <View key={index}>
              <View style={styles.statusDebug}>
                <Text style={styles.statusDebugText}>{port.status}</Text>
              </View>
              <TouchableHighlight onPress={() => scrollToSlot(port.slot)}>
                <View>
                <View style={[styles.slot, (itemDef && (itemDef.image_url != "")) ? {opacity: 1} : {opacity: 0.1}]}>
                  {thumb}
                </View>
                <View style={isSelected ? styles.slotCaptionHighlight : styles.slotCaption}>
                  <Text style={styles.slotCaptionText}>{port.slot + 1}</Text>
                </View>
                </View>
              </TouchableHighlight>
            </View>
          )
        })}
      </View>
    )
  })
  
  const ListComponent = observer(({portData}) => {
    // [eschwartz-TODO] Observed changes on port data is not working. Accessing other changing data
    // (counter) on same observable object as a workaround to force re-render.
    var access = portData.counter
    return (
      <View>
        <SwiperFlatList
          ref={sliderRef}
          //onChangeIndex={indexChanged}
          onRefresh={onRefresh}
          refreshing={refreshing}
          vertical={vertical}
          paginationStyleItem={styles.paginationStyleItem}
          paginationDefaultColor={'transparent'}
          paginationActiveColor={color.palette.cheerioCenter}
          data={portData.ports}
          ListEmptyComponent={EmptyMessage}
          renderItem={renderPort}
          //extraData={{ extraDataForMobX: portStore.ports.length > 0 ? portStore.ports[0] : "" }}
          keyExtractor={port => (port.device_id + port.slot)}
        />
      </View>
    )
  })

  return (
    <View style={styles.container}>
      {/* <View><Text style={{color: '#ddd', fontSize: 16}}>Eric's Cereal Shelf 1</Text></View> */}
      <Shelf portData={portData} />
      <ListComponent portData={portData} />
    </View>
  )
}