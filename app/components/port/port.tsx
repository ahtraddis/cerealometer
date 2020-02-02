import * as React from "react"
import { useStores } from "../../models/root-store"
import { View, StyleSheet } from "react-native"
import { Item as ItemType } from "../../models/item"
import { Port as PortType } from "../../models/port"
import { ItemDefinition } from "../../models/item-definition"
import { Device } from "../../models/device"
import { Item } from "../../components"
import { Text } from "../"
import { ITEM_COMMON } from "../../components/item/item"
import { color } from "../../theme/color"
import * as Progress from 'react-native-progress'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  portInfoView: {
    flexDirection: 'row'
  },
  slotLabelView: {
    flex: 1,
    height: 18,
    justifyContent: 'center',
    marginBottom: 10,
  },
  slotLabelText: {
    fontSize: 16,
    textAlign: 'center',
  },
  vacantSlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacantMessage: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacantMessageTitle: {
    fontSize: 30,
    color: '#777',
    marginBottom: 10
  },
  vacantMessageText: {
    fontSize: 20,
    color: '#777',
  },
  vacantMessageBody: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  vacantMessageIcon: {
    justifyContent: 'center',
    paddingRight: 5,
  },
  vacantMessageTextContainer: {
    justifyContent: 'center',
  },
  vacantDebug: {
    flex: 0,
    //display: 'none',
  },
  vacantSlotDebugText: {
    fontSize: 14,
    color: '#777',
  },
  item: {
    ...ITEM_COMMON,
    backgroundColor: color.palette.darkerPurple,
  },
})

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
    <View style={styles.container}>
      <View style={styles.portInfoView}>
        <View style={styles.slotLabelView}>
          <Text style={styles.slotLabelText}>
            SLOT {port.slot + 1}
          </Text>
        </View>
      </View>
      { !item && (
        <View style={styles.item}>
          <View style={styles.vacantSlot}>
            <View style={styles.vacantMessage}>
              <Text style={styles.vacantMessageTitle} text={statusTitle} />
              <View style={styles.vacantMessageBody}>
                { (port.status == 'CLEARING') && (
                  <View style={styles.vacantMessageIcon}>
                    <Progress.Circle
                      color={'#777'}
                      size={14}
                      indeterminate={true}
                    />
                  </View>
                )}
                <View style={styles.vacantMessageTextContainer}>
                  <Text style={styles.vacantMessageText} text={statusMsg} />
                </View>
              </View>
            </View>
            <View style={styles.vacantDebug}>
              <Text style={styles.vacantSlotDebugText}>
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
