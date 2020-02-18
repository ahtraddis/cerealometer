import * as React from "react"
import { useStores } from "../../models/root-store"
import { View } from "react-native"
import { Item as ItemType } from "../../models/item"
import { Port as PortType } from "../../models/port"
import { ItemDefinition } from "../../models/item-definition"
import { Device } from "../../models/device"
import { Item } from "../../components"
import { Text } from "../"
import { styles } from "./port.styles"
import * as Progress from 'react-native-progress'

export interface PortProps {
  port: PortType
  item: ItemType
  itemDefinition: ItemDefinition
  device: Device
}

export const ClearingMessage = props => {
  const { slot } = props
  return (
    <View style={styles.item}>
      <View style={styles.vacantSlot}>
        <View style={styles.vacantMessage}>
          <Text style={styles.vacantMessageTitle} tx={"port.clearingTitle"} />
          <View style={styles.vacantMessageBody}>
            <View style={styles.vacantMessageIcon}>
              <Progress.Circle
                style={styles.progress}
                color={'#777'}
                size={14}
                indeterminate={true}
              />
            </View>
            <View style={styles.vacantMessageTextContainer}>
              <Text
                style={styles.vacantMessageText}
                tx={"port.clearingMessage"}
                txOptions={{slot: slot + 1}} />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
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

  return (
    <View style={styles.container}>
      { (port.status == 'CLEARING') && (
        <ClearingMessage slot={port.slot} />
      )}
      { !item && (port.status != 'CLEARING') && (
        <View style={styles.item}>
          <View style={styles.vacantSlot}>
            <View style={styles.vacantMessage}>
              <Text
                style={styles.vacantMessageTitle}
                tx={itemStore.items.length ? "port.vacantTitle" : "port.vacantNoItemsTitle"}
              />
              <View style={styles.vacantMessageBody}>
                <View style={styles.vacantMessageTextContainer}>
                  <Text
                    style={styles.vacantMessageText}
                    tx={itemStore.items.length ? "port.vacantMessage" : "port.vacantNoItemsMessage"}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
      { item && itemDefinition && (port.status != 'CLEARING') && (
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
