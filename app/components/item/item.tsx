import * as React from "react"
import { useStores } from "../../models/root-store"
import { useState, useEffect } from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Image, ScrollView } from "react-native"
import { Text } from "../"
import { Button, LoadingButton } from "../../components"
import { ItemDefinition } from "../../models/item-definition"
import { Port } from "../../models/port"
import { Device } from "../../models/device"
import { BOLD } from "../../styles/common"
import { getBoundedPercentage } from "../../utils/math"
var moment = require('moment');

const NUTRITION_TEXT: TextStyle = {
  fontFamily: 'sans-serif-condensed',
}
const WRAPPER: ViewStyle = {
  flex: 1,
}
export const ITEM_COMMON: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  padding: 10,
  paddingLeft: 0,
  borderRadius: 3,
  margin: 10,
  marginTop: 0,
}
const ITEM: ViewStyle = {
  ...ITEM_COMMON,
  backgroundColor: '#fff',
}
const IMAGE_BUTTONS_VIEW: ViewStyle = {
  flex: 3,
}
const IMAGE_VIEW: ViewStyle = {
  flex: 1,
  paddingRight: 5,
  paddingLeft: 5,
}
const BUTTON_VIEW: ViewStyle = {
  flex: 2,
}
const ITEM_INFO_VIEW: ViewStyle = {
  flex: 7,
  overflow: 'hidden',
  borderWidth: 1,
  paddingLeft: 5,
  paddingRight: 5,
}
const IMAGE: ImageStyle = {
  flex: 1,
  resizeMode: 'contain',
}
const ITEM_INFO: ViewStyle = {}
const ITEM_NAME: ViewStyle = {
  marginBottom: 5,
  borderBottomColor: '#000',
}
const ITEM_NAME_TEXT: TextStyle = {
  ...NUTRITION_TEXT,
  ...BOLD,
  fontSize: 22,
  color: '#000',
}
const TEXT_LABEL: TextStyle = {
  ...NUTRITION_TEXT,
  color: '#000',
  ...BOLD,
  borderBottomColor: '#000',
  borderBottomWidth: 1,
  paddingBottom: 2,
  paddingTop: 2,
}
const TEXT_VALUE: TextStyle = {
  color: '#000',
  ...NUTRITION_TEXT,
  fontWeight: 'normal',
}
const DIVIDER: ViewStyle = {
  borderBottomWidth: 10,
  borderBottomColor: '#000,'
}
const BUTTONS: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 10,
}
const BUTTON: ViewStyle = {
  padding: 3,
  marginTop: 10,
  marginBottom: 5,
  backgroundColor: '#72551e',
  width: 75,
}
const BUTTON_DISABLED: ViewStyle = {
  ...BUTTON,
  backgroundColor: '#ddcbb3',
}
const BUTTON_TEXT: TextStyle = {
  fontSize: 12,
}

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

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150/000000/FFFFFF?text=%3F'

  return (
    <View style={WRAPPER}>
      <View style={ITEM}>
        { true &&
          <View style={IMAGE_BUTTONS_VIEW}>
            <View style={IMAGE_VIEW}>
              { true && (
                <Image style={IMAGE} source={{uri: itemDef ? itemDef.image_url : PLACEHOLDER_IMAGE }} />
              )}
            </View>
            <View style={BUTTON_VIEW}>
              <View style={BUTTONS}>
                { (port && !isPortView) && (
                  <Button
                    disabled={true}
                    style={BUTTON_DISABLED}
                    textStyle={BUTTON_TEXT}
                    tx={"item.installed"}
                  />
                )}
                { ((port && isPortView) || (!port && !isPortView)) && (
                  <LoadingButton
                    isLoading={moving}
                    disabled={!buttonEnabled}
                    style={buttonEnabled ? BUTTON : BUTTON_DISABLED}
                    textStyle={BUTTON_TEXT}
                    tx={port ? "item.removeFromShelf" : "item.addToShelf"}
                    onPress={port ? clearPortItem : setPortItem}
                  />
                )}
                <LoadingButton
                  isLoading={deleting}
                  style={BUTTON}
                  textStyle={BUTTON_TEXT}
                  tx={"item.deleteButtonLabel"}
                  onPress={deleteItem}
                />                
                { port && isPortView && (
                  <LoadingButton
                    isLoading={taring}
                    disabled={!tareEnabled}
                    style={tareEnabled ? BUTTON : BUTTON_DISABLED}
                    textStyle={BUTTON_TEXT}
                    tx={"item.updateTareWeightButtonLabel"}
                    onPress={updateTareWeight}
                  />
                )}
              </View>
            </View>
          </View>
        }
        <View style={ITEM_INFO_VIEW}>
          <View style={ITEM_INFO}>
            { true && (
              <View style={ITEM_NAME}>
                <Text style={ITEM_NAME_TEXT}>
                  {itemDef ? itemDef.name : "Unknown Item"}
                </Text>
              </View>
            )}
            <View style={DIVIDER} />
            <Text style={TEXT_LABEL}>
              Last Seen
              &nbsp;<Text style={TEXT_VALUE}>
                {last_update_time ? moment.unix(last_update_time).fromNow() : "Never" }
              </Text>
            </Text>
            <Text style={TEXT_LABEL}>
              Last Weight
              &nbsp;<Text style={TEXT_VALUE}>
                {parseFloat(last_known_weight_kg).toFixed(4)} kg
              </Text>
            </Text>
            { itemDef && (itemDef.net_weight_kg > 0) && (last_known_weight_kg > 0) && (
              <Text style={TEXT_LABEL}>
                Amount Remaining
                &nbsp;<Text style={TEXT_VALUE}>
                  { parseFloat(getBoundedPercentage(itemDef.tare_weight_kg ? (last_known_weight_kg - itemDef.tare_weight_kg) : last_known_weight_kg, itemDef.net_weight_kg)).toFixed(0) }%
                </Text>
              </Text>
            )}
            <View style={DIVIDER} />
            { itemDef && (
              <Text style={TEXT_LABEL}>
                Net Weight
                &nbsp;<Text style={TEXT_VALUE}>
                  { parseFloat(itemDef.net_weight_kg).toFixed(3) } kg
                </Text>
              </Text>
            )}
            { itemDef && (
              <Text style={TEXT_LABEL}>
                Tare Weight
                &nbsp;<Text style={TEXT_VALUE}>
                  {itemDef.tare_weight_kg ? parseFloat(itemDef.tare_weight_kg).toFixed(3) + " kg" : "Unknown"}
                </Text>
              </Text>
            )}
            { itemDef && (
              <Text style={TEXT_LABEL}>
                UPC
                &nbsp;<Text style={TEXT_VALUE}>
                  {itemDef.upc}
                </Text>
              </Text>
            )}
            <View style={DIVIDER} />
          </View>
        </View>
      </View>
    </View>
  )
}
