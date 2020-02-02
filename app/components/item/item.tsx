import * as React from "react"
import { useStores } from "../../models/root-store"
import { useState, useEffect } from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Image, StyleSheet } from "react-native"
import { Text } from "../"
import { Button, LoadingButton } from "../../components"
import { ItemDefinition } from "../../models/item-definition"
import { Port } from "../../models/port"
import { Device } from "../../models/device"
import { BOLD } from "../../styles/common"
import { getBoundedPercentage } from "../../utils/math"
var moment = require('moment');

export const ITEM_COMMON: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  padding: 10,
  paddingLeft: 0,
  borderRadius: 3,
  margin: 10,
  marginTop: 0,
}
const NUTRITION_TEXT: TextStyle = {
  fontFamily: 'sans-serif-condensed',
}
const BUTTON: ViewStyle = {
  padding: 3,
  marginTop: 10,
  marginBottom: 5,
  backgroundColor: '#72551e',
  width: 75,
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  nutritionText: {
    ...NUTRITION_TEXT,
  },
  container: {
    ...ITEM_COMMON,
    backgroundColor: '#fff',
  },
  imageButtonsView: {
    flex: 3,
  },
  imageView: {
    flex: 1,
    paddingRight: 5,
    paddingLeft: 5,
  },
  buttonView: {
    flex: 2,
  },
  itemInfoView: {
    flex: 7,
    overflow: 'hidden',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  itemInfo: {},
  itemName: {
    marginBottom: 5,
    borderBottomColor: '#000',
  },
  itemNameText: {
    ...NUTRITION_TEXT,
    ...BOLD,
    fontSize: 22,
    color: '#000',
  },
  textLabel: {
    ...NUTRITION_TEXT,
    color: '#000',
    ...BOLD,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    paddingBottom: 2,
    paddingTop: 2,
  },
  textValue: {
    color: '#000',
    ...NUTRITION_TEXT,
    fontWeight: 'normal',
  },
  divider: {
    borderBottomWidth: 10,
    borderBottomColor: '#000',
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  button: {
    ...BUTTON,
  },
  buttonDisabled: {
    ...BUTTON,
    backgroundColor: '#ddcbb3',
  },
  buttonText: {
    fontSize: 12,
  },
})

export interface ItemProps {
  id: string
  item_definition_id: string
  last_known_weight_kg: number
  last_update_time: number
  user_id: string
  itemDefinition: ItemDefinition
  port: Port
  device: Device
  isPortView: boolean
}

/**
 * Display a single user item
 */
export function Item(props: ItemProps) {
  const {
      id,
      item_definition_id,
      last_known_weight_kg,
      last_update_time,
      user_id,
      itemDefinition,
      port,
      device,
      isPortView,
      ...rest
  } = props
  
  useEffect(() => {
    // [eschwartz-TODO] Hack to force render
    //setCount(count + 1)
  }, []);

  const { itemStore, itemDefinitionStore, portStore } = useStores()
  const [taring, setTaring] = useState(false)
  const [count, setCount] = useState(0)
  const [moving, setMoving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150/000000/FFFFFF?text=%3F'

  const vacantPort = portStore.ports.find((port) => (port.status == 'VACANT'))
  const itemDef = itemDefinition

  const tareEnabled = itemDef && port && (port.status == 'LOADED') && (itemDef.net_weight_kg > 0) && (!itemDef.tare_weight_kg || (last_known_weight_kg > itemDef.net_weight_kg))
  const buttonEnabled = port || vacantPort
  
  const clearPortItem = async() => {
    const port = portStore.ports.find((port) => (port.item_id == id))
    setMoving(true)
    await portStore.clearPortItem(port.device_id, port.slot)
    setMoving(false)
    // [eschwartz-TODO] Hack to force render
    setCount(count + 1)
  }

  const setPortItem = async() => {
    if (vacantPort) {
      setMoving(true)
      await portStore.setPortItem(vacantPort.device_id, vacantPort.slot, id)
      setMoving(false)
      // [eschwartz-TODO] Hack to force render
      setCount(count + 1)
    }
  }

  const deleteItem = async() => {
    setDeleting(true)
    await itemStore.deleteItem(id)
    setDeleting(false)
  }

  /**
   * Update item def tare weight by measuring gross weight
   */
  const updateTareWeight = async() => {
    // Only update if item is on the scale and weight exceeds the known net weight
    if (port && (port.status == 'LOADED') && (last_known_weight_kg > itemDef.net_weight_kg)) {
      const tareWeightKg = last_known_weight_kg - itemDef.net_weight_kg
      setTaring(true)
      await itemDefinitionStore.updateTareWeight(item_definition_id, tareWeightKg)
      setTaring(false)
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.imageButtonsView}>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={{uri: itemDef ? itemDef.image_url : PLACEHOLDER_IMAGE }} />
          </View>
          <View style={styles.buttonView}>
            <View style={styles.buttons}>
              { (port && !isPortView) && (
                <Button
                  disabled={true}
                  style={styles.buttonDisabled}
                  textStyle={styles.buttonText}
                  tx={"item.installed"}
                />
              )}
              { ((port && isPortView) || (!port && !isPortView)) && (
                <LoadingButton
                  isLoading={moving}
                  disabled={!buttonEnabled}
                  style={buttonEnabled ? styles.button : styles.buttonDisabled}
                  textStyle={styles.buttonText}
                  tx={port ? "item.removeFromShelf" : "item.addToShelf"}
                  onPress={port ? clearPortItem : setPortItem}
                />
              )}
              <LoadingButton
                isLoading={deleting}
                style={BUTTON}
                textStyle={styles.buttonText}
                tx={"item.deleteButtonLabel"}
                onPress={deleteItem}
              />                
              { port && isPortView && (
                <LoadingButton
                  isLoading={taring}
                  disabled={!tareEnabled}
                  style={tareEnabled ? styles.button : styles.buttonDisabled}
                  textStyle={styles.buttonText}
                  tx={"item.updateTareWeightButtonLabel"}
                  onPress={updateTareWeight}
                />
              )}
            </View>
          </View>
        </View>
        <View style={styles.itemInfoView}>
          <View style={styles.itemInfo}>
            <View style={styles.itemName}>
              <Text style={styles.itemNameText}>
                {itemDef ? itemDef.name : "Unknown Item"}
              </Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.textLabel}>
              Last Seen
              &nbsp;<Text style={styles.textValue}>
                {last_update_time ? moment.unix(last_update_time).fromNow() : "Never" }
              </Text>
            </Text>
            <Text style={styles.textLabel}>
              Last Weight
              &nbsp;<Text style={styles.textValue}>
                {parseFloat(last_known_weight_kg).toFixed(4)} kg
              </Text>
            </Text>
            { itemDef && (itemDef.net_weight_kg > 0) && (last_known_weight_kg > 0) && (
              <Text style={styles.textLabel}>
                Amount Remaining
                &nbsp;<Text style={styles.textValue}>
                  { parseFloat(getBoundedPercentage(itemDef.tare_weight_kg ? (last_known_weight_kg - itemDef.tare_weight_kg) : last_known_weight_kg, itemDef.net_weight_kg)).toFixed(0) }%
                </Text>
              </Text>
            )}
            <View style={styles.divider} />
            { itemDef && (
              <Text style={styles.textLabel}>
                Net Weight
                &nbsp;<Text style={styles.textValue}>
                  { parseFloat(itemDef.net_weight_kg).toFixed(3) } kg
                </Text>
              </Text>
            )}
            { itemDef && (
              <Text style={styles.textLabel}>
                Tare Weight
                &nbsp;<Text style={styles.textValue}>
                  {itemDef.tare_weight_kg ? parseFloat(itemDef.tare_weight_kg).toFixed(3) + " kg" : "Unknown"}
                </Text>
              </Text>
            )}
            { itemDef && (
              <Text style={styles.textLabel}>
                UPC
                &nbsp;<Text style={styles.textValue}>
                  {itemDef.upc}
                </Text>
              </Text>
            )}
            <View style={styles.divider} />
          </View>
        </View>
      </View>
    </View>
  )
}
