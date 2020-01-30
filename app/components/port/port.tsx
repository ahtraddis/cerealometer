import * as React from "react"
import { useStores } from "../../models/root-store"
import { View, ViewStyle, TextStyle } from "react-native"
import { Item as ItemType } from "../../models/item"
import { Port as PortType } from "../../models/port"
import { ItemDefinition } from "../../models/item-definition"
import { Device } from "../../models/device"
import { Item } from "../../components"
import { Text } from "../"
import { ITEM_COMMON } from "../../components/item/item"
import { color } from "../../theme/color"
import * as Progress from 'react-native-progress'

const PORT: ViewStyle = {
  flex: 1,
}
const PORT_INFO_VIEW: ViewStyle = {
  flexDirection: 'row'
}
const SLOT_LABEL_VIEW: ViewStyle = {
  flex: 1,
  height: 18,
  justifyContent: 'center',
  marginBottom: 10,
}
const SLOT_LABEL_TEXT: TextStyle = {
  fontSize: 16,
  textAlign: 'center',
}
const VACANT_SLOT: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}
const VACANT_MESSAGE: ViewStyle = {
  flex: 3,
  justifyContent: 'center',
  alignItems: 'center',
}
const VACANT_MESSAGE_TITLE: TextStyle = {
  fontSize: 30,
  color: '#777',
  marginBottom: 10
}
const VACANT_MESSAGE_TEXT: TextStyle = {
  fontSize: 20,
  color: '#777',
}
const VACANT_MESSAGE_MESSAGE: TextStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
}
const VACANT_MESSAGE_ICON: TextStyle = {
  justifyContent: 'center',
  paddingRight: 5,
}
const VACANT_MESSAGE_TEXT_CONTAINER: TextStyle = {
  justifyContent: 'center',
}

const VACANT_DEBUG: ViewStyle = {
  flex: 0,
  //display: 'none',
}
const VACANT_SLOT_DEBUG_TEXT: TextStyle = {
  fontSize: 14,
  color: '#777',
}
const ITEM: ViewStyle = {
  ...ITEM_COMMON,
  backgroundColor: color.palette.darkerPurple,
}

export interface PortProps {
  port: PortType
  item: ItemType
  itemDefinition: ItemDefinition
  device: Device
}

/**
 * Wrapper component for Item, adding port info for Shelf screen
 * 
 * @param props 
 */
export function Port(props: PortProps) {
  const {
    port,
    item,
    itemDefinition,
    device,
    ...rest
  } = props

  const { itemStore } = useStores()

  let statusTitle, statusMsg
  if (port.status == 'CLEARING') {
    statusTitle = 'Please remove item'
    statusMsg = 'Waiting for scale to clear...'
  } else {
    if (itemStore.items.length) {
      statusTitle = 'Slot available'
      statusMsg = 'To select item, tap Overstock.'
    } else {
      statusTitle = 'No cereal yet'
      statusMsg = 'To get started, tap Scan.'
    }
  }

  return (
    <View style={PORT}>
      <View style={PORT_INFO_VIEW}>
        <View style={SLOT_LABEL_VIEW}>
          <Text style={SLOT_LABEL_TEXT}>
            SLOT {port.slot + 1}
          </Text>
        </View>
      </View>
      { !item && (
        <View style={ITEM}>
          <View style={VACANT_SLOT}>
            <View style={VACANT_MESSAGE}>
              <Text style={VACANT_MESSAGE_TITLE} text={statusTitle} />
              <View style={VACANT_MESSAGE_MESSAGE}>
                { (port.status == 'CLEARING') && (
                  <View style={VACANT_MESSAGE_ICON}>
                    <Progress.Circle
                      color={'#777'}
                      size={14}
                      indeterminate={true}
                    />
                  </View>
                )}
                <View style={VACANT_MESSAGE_TEXT_CONTAINER}>
                  <Text style={VACANT_MESSAGE_TEXT} text={statusMsg} />
                </View>
              </View>
            </View>
            <View style={VACANT_DEBUG}>
              <Text style={VACANT_SLOT_DEBUG_TEXT}>
                device_id: {port.device_id},
                status: {port.status},
                weight_kg: {port.weight_kg},
                item_id: "{port.item_id}",
                last_update_time: {port.last_update_time}
              </Text>
            </View>
          </View>
        </View>
      )}
      { item && itemDefinition && (
        <Item
          {...item}
          port={port}
          itemDefinition={itemDefinition}
          device={device}
          isPortView={true}
        />
      )}
    </View>
  )
}
